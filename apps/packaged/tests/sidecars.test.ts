/**
 * Regression coverage for the GD_LEGACY_DATA_DIR migration-aware
 * daemon status timeout in apps/packaged/src/sidecars.ts.
 *
 * Background: when the user is recovering 0.3.x `.gd/` data via
 * GD_LEGACY_DATA_DIR, apps/daemon/src/legacy-data-migrator.ts runs a
 * synchronous payload copy at module import time, before the daemon
 * sidecar can answer status. With the default 35-second status budget
 * a multi-GB legacy `.gd/projects` or `.gd/artifacts` tree can hit the
 * timeout while staging is still copying, after which the parent tears
 * the child down mid-promotion and can leave dataDir half-promoted
 * even with the in-process rollback.
 *
 * @see apps/packaged/src/sidecars.ts
 * @see apps/daemon/src/legacy-data-migrator.ts
 * @see https://github.com/galyarderlabs/galyarder-design/issues/710
 */
import { EventEmitter } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  buildPackagedDaemonSpawnEnv,
  resolveDaemonStatusTimeoutMs,
  resolvePackagedChildBaseEnv,
  resolvePackagedPathEnv,
  waitForStatus,
} from '../src/sidecars.js';
import type { PackagedNamespacePaths } from '../src/paths.js';

describe('resolveDaemonStatusTimeoutMs', () => {
  it('uses the default 35-second budget for normal cold boots', () => {
    expect(resolveDaemonStatusTimeoutMs({})).toBe(35_000);
  });

  it('treats an empty GD_LEGACY_DATA_DIR as unset', () => {
    expect(resolveDaemonStatusTimeoutMs({ GD_LEGACY_DATA_DIR: '' })).toBe(35_000);
  });

  it('extends the budget to 30 minutes when GD_LEGACY_DATA_DIR is set', () => {
    // The packaged sidecar must give the daemon a long-enough window to
    // sync-copy a multi-GB legacy `.gd/` payload. Anything below ~10
    // minutes was historically observed to time out on real installs.
    const value = resolveDaemonStatusTimeoutMs({
      GD_LEGACY_DATA_DIR: '/path/to/old/.gd',
    });
    expect(value).toBeGreaterThanOrEqual(10 * 60 * 1000);
    expect(value).toBe(30 * 60 * 1000);
  });

  it('falls back to process.env when called with no argument', () => {
    const original = process.env.GD_LEGACY_DATA_DIR;
    try {
      delete process.env.GD_LEGACY_DATA_DIR;
      expect(resolveDaemonStatusTimeoutMs()).toBe(35_000);
      process.env.GD_LEGACY_DATA_DIR = '/some/legacy/path';
      expect(resolveDaemonStatusTimeoutMs()).toBe(30 * 60 * 1000);
    } finally {
      if (original == null) delete process.env.GD_LEGACY_DATA_DIR;
      else process.env.GD_LEGACY_DATA_DIR = original;
    }
  });
});

describe('packaged child Vite+ environment forwarding', () => {
  it('keeps VP_HOME in the packaged child base env without forwarding unrelated variables', () => {
    const env = resolvePackagedChildBaseEnv({
      HOME: '/Users/tester',
      LANG: 'en_US.UTF-8',
      RANDOM_INTERNAL_FLAG: 'drop-me',
      VP_HOME: '/Users/tester/.custom-vite-plus',
    });

    expect(env).toMatchObject({
      HOME: '/Users/tester',
      LANG: 'en_US.UTF-8',
      VP_HOME: '/Users/tester/.custom-vite-plus',
    });
    expect(env.RANDOM_INTERNAL_FLAG).toBeUndefined();
  });

  it('forwards standard proxy variables to packaged sidecars', () => {
    const env = resolvePackagedChildBaseEnv({
      HOME: '/Users/tester',
      HTTP_PROXY: 'http://127.0.0.1:7890',
      HTTPS_PROXY: 'http://127.0.0.1:7890',
      NO_PROXY: 'localhost,127.0.0.1',
      RANDOM_INTERNAL_FLAG: 'drop-me',
    });

    expect(env).toMatchObject({
      HOME: '/Users/tester',
      HTTP_PROXY: 'http://127.0.0.1:7890',
      HTTPS_PROXY: 'http://127.0.0.1:7890',
      NO_PROXY: 'localhost,127.0.0.1',
    });
    expect(env.RANDOM_INTERNAL_FLAG).toBeUndefined();
  });

  it('adds custom VP_HOME/bin to the packaged PATH builder', () => {
    const vpHome = mkdtempSync(join(tmpdir(), 'gd-packaged-vp-home-'));
    const originalVpHome = process.env.VP_HOME;
    try {
      process.env.VP_HOME = vpHome;
      const pathEntries = resolvePackagedPathEnv('/usr/bin').split(delimiter);

      expect(pathEntries).toContain('/usr/bin');
      expect(pathEntries).toContain(join(vpHome, 'bin'));
    } finally {
      if (originalVpHome == null) delete process.env.VP_HOME;
      else process.env.VP_HOME = originalVpHome;
      rmSync(vpHome, { recursive: true, force: true });
    }
  });
});

/**
 * Build a child-process stand-in that satisfies the `watch.child`
 * shape `waitForStatus` consumes. We only use `once('exit')`,
 * `off('exit')`, and the synchronous `exitCode` / `signalCode`
 * fields, so an EventEmitter plus those two properties is enough.
 */
function fakeChild(): EventEmitter & {
  exitCode: number | null;
  signalCode: NodeJS.Signals | null;
  fireExit: (code: number | null, signal: NodeJS.Signals | null) => void;
} {
  const emitter = new EventEmitter() as EventEmitter & {
    exitCode: number | null;
    signalCode: NodeJS.Signals | null;
    fireExit: (code: number | null, signal: NodeJS.Signals | null) => void;
  };
  emitter.exitCode = null;
  emitter.signalCode = null;
  emitter.fireExit = (code, signal) => {
    emitter.exitCode = code;
    emitter.signalCode = signal;
    emitter.emit('exit', code, signal);
  };
  return emitter;
}

describe('buildPackagedDaemonSpawnEnv', () => {
  // PR #974 round-5 (lefarcen P2): the daemon's import-folder gate must
  // be ON when an Electron desktop is being started alongside the daemon
  // and OFF in headless packaged mode (daemon+web only, no shell.openPath
  // surface, no client to register a secret). Pin both branches against
  // a real pure-helper invocation so a future refactor can't silently
  // regress either side.
  function fakePaths(): PackagedNamespacePaths {
    return {
      cacheRoot: '/tmp/gd-pkg/cache',
      dataRoot: '/tmp/gd-pkg/data',
      desktopIdentityPath: '/tmp/gd-pkg/runtime/desktop-root.json',
      desktopLogPath: '/tmp/gd-pkg/logs/desktop/latest.log',
      desktopLogsRoot: '/tmp/gd-pkg/logs/desktop',
      electronSessionDataRoot: '/tmp/gd-pkg/user-data/session',
      electronUserDataRoot: '/tmp/gd-pkg/user-data',
      headlessIdentityPath: '/tmp/gd-pkg/runtime/headless-root.json',
      installationRoot: '/tmp/gd-pkg/..',
      installerObservationRoot: '/tmp/gd-pkg/data/observations/installer',
      logsRoot: '/tmp/gd-pkg/logs',
      namespaceRoot: '/tmp/gd-pkg',
      resourceRoot: '/tmp/gd-pkg/resources',
      runtimeRoot: '/tmp/gd-pkg/runtime',
      updateRoot: '/tmp/gd-pkg/updates',
      webIdentityPath: '/tmp/gd-pkg/runtime/web-root.json',
    };
  }

  it('sets GD_REQUIRE_DESKTOP_AUTH=1 when requireDesktopAuth=true (Electron entry)', () => {
    const env = buildPackagedDaemonSpawnEnv(fakePaths(), {
      appVersion: '1.2.3',
      daemonCliEntry: null,
      legacyDataDir: null,
      requireDesktopAuth: true,
    });
    expect(env.GD_REQUIRE_DESKTOP_AUTH).toBe('1');
    expect(env.GD_DATA_DIR).toBe('/tmp/gd-pkg/data');
    expect(env.GD_RESOURCE_ROOT).toBe('/tmp/gd-pkg/resources');
    expect(env.GD_APP_VERSION).toBe('1.2.3');
    expect(env.GD_LEGACY_DATA_DIR).toBeUndefined();
  });

  it('omits GD_REQUIRE_DESKTOP_AUTH entirely when requireDesktopAuth=false (headless)', () => {
    const env = buildPackagedDaemonSpawnEnv(fakePaths(), {
      appVersion: null,
      daemonCliEntry: null,
      legacyDataDir: null,
      requireDesktopAuth: false,
    });
    // Round-5 (lefarcen P2): MUST NOT set the env var, even to "0" —
    // the daemon's gate trigger is `process.env.GD_REQUIRE_DESKTOP_AUTH === '1'`,
    // so a literal "0" would behave the same as omitted today, but a
    // future code change to truthy-check the variable would silently
    // re-arm the gate. Omitted is the intent.
    expect('GD_REQUIRE_DESKTOP_AUTH' in env).toBe(false);
    expect(env.GD_DATA_DIR).toBe('/tmp/gd-pkg/data');
    expect(env.GD_APP_VERSION).toBeUndefined();
  });

  it('forwards GD_LEGACY_DATA_DIR only when set, irrespective of requireDesktopAuth', () => {
    const withLegacy = buildPackagedDaemonSpawnEnv(fakePaths(), {
      appVersion: null,
      daemonCliEntry: null,
      legacyDataDir: '/old/.gd',
      requireDesktopAuth: false,
    });
    expect(withLegacy.GD_LEGACY_DATA_DIR).toBe('/old/.gd');

    const withEmptyLegacy = buildPackagedDaemonSpawnEnv(fakePaths(), {
      appVersion: null,
      daemonCliEntry: null,
      legacyDataDir: '',
      requireDesktopAuth: true,
    });
    // Empty string must NOT propagate — daemon treats "env set but
    // path invalid" as an error and refuses to start.
    expect('GD_LEGACY_DATA_DIR' in withEmptyLegacy).toBe(false);
  });

  it('forwards daemonCliEntry through GD_DAEMON_CLI_PATH when set', () => {
    const env = buildPackagedDaemonSpawnEnv(fakePaths(), {
      appVersion: null,
      daemonCliEntry: '/path/to/cli/dist/index.js',
      legacyDataDir: null,
      requireDesktopAuth: true,
    });
    expect(env.GD_DAEMON_CLI_PATH).toBe('/path/to/cli/dist/index.js');
  });

  it('forwards the packaged telemetry relay URL to the daemon when configured', () => {
    const env = buildPackagedDaemonSpawnEnv(fakePaths(), {
      appVersion: null,
      daemonCliEntry: null,
      legacyDataDir: null,
      requireDesktopAuth: true,
      telemetryRelayUrl: 'https://telemetry.galyarder-design.ai/api/langfuse',
    });
    expect(env.GALYARDER_DESIGN_TELEMETRY_RELAY_URL).toBe(
      'https://telemetry.galyarder-design.ai/api/langfuse',
    );
  });

  it('forwards POSTHOG_KEY/POSTHOG_HOST to the daemon spawn env when baked into the bundle', () => {
    const env = buildPackagedDaemonSpawnEnv(fakePaths(), {
      appVersion: null,
      daemonCliEntry: null,
      legacyDataDir: null,
      requireDesktopAuth: true,
      posthogKey: 'phc_packaged_test',
      posthogHost: 'https://us.i.posthog.com',
    });
    expect(env.POSTHOG_KEY).toBe('phc_packaged_test');
    expect(env.POSTHOG_HOST).toBe('https://us.i.posthog.com');
  });

  it('omits POSTHOG_KEY/POSTHOG_HOST for fork builds that lack the secret', () => {
    const env = buildPackagedDaemonSpawnEnv(fakePaths(), {
      appVersion: null,
      daemonCliEntry: null,
      legacyDataDir: null,
      requireDesktopAuth: true,
      posthogKey: null,
      posthogHost: null,
    });
    expect(env.POSTHOG_KEY).toBeUndefined();
    expect(env.POSTHOG_HOST).toBeUndefined();
  });
});

describe('waitForStatus child-exit fast-fail', () => {
  // mrcfps round-7: when GD_LEGACY_DATA_DIR is set the daemon status
  // budget extends to 30 minutes for legitimate large-payload migrations.
  // But a daemon that throws LegacyMigrationError at startup (invalid
  // legacy dir, existing target payload, symlink, marker write failure)
  // exits before reporting status, and waiting the full 30 minutes makes
  // the packaged app look hung. Racing the IPC polling against the
  // child's exit event surfaces the failure promptly with a pointer to
  // the daemon log.

  it('rejects within milliseconds when the child exits before status is ready', async () => {
    const child = fakeChild();
    const ipcPath = '/tmp/gd-test-no-such-ipc-' + Date.now();
    const logPath = '/tmp/gd-test-daemon.log';

    const startedAt = Date.now();
    const promise = waitForStatus<{ url: string | null }>(
      ipcPath,
      (status) => status.url != null,
      30 * 60 * 1000,
      { child, logPath },
    );

    // Simulate the daemon throwing in its startup migrator and exiting
    // immediately. With the old code, the wait would have blocked for
    // the full 30-minute budget; with the fix it must reject fast.
    setTimeout(() => child.fireExit(1, null), 50);

    let captured: unknown;
    try {
      await promise;
    } catch (err) {
      captured = err;
    }
    const elapsed = Date.now() - startedAt;

    expect(captured).toBeInstanceOf(Error);
    expect((captured as Error).message).toMatch(/daemon exited before reporting status/);
    expect((captured as Error).message).toContain('code=1');
    expect((captured as Error).message).toContain(logPath);

    // The whole point: don't sit through DAEMON_MIGRATION_STATUS_TIMEOUT_MS.
    // Allow generous slack for slow CI runners; the fix should bound this
    // to roughly the IPC poll cadence (150ms) plus a couple of timer ticks.
    expect(elapsed).toBeLessThan(2_000);
  });

  it('detects a child that exited synchronously before waitForStatus was entered', async () => {
    const child = fakeChild();
    // Pretend the daemon process already exited before we got here. The
    // 'exit' event has already fired and would not re-fire for a late
    // listener, so waitForStatus must read the synchronous exitCode /
    // signalCode fields to see the bad state.
    child.exitCode = 2;
    child.signalCode = null;

    const startedAt = Date.now();
    let captured: unknown;
    try {
      await waitForStatus<{ url: string | null }>(
        '/tmp/gd-test-no-such-ipc-pre-' + Date.now(),
        (status) => status.url != null,
        30 * 60 * 1000,
        { child, logPath: '/tmp/gd-test-daemon.log' },
      );
    } catch (err) {
      captured = err;
    }
    const elapsed = Date.now() - startedAt;

    expect(captured).toBeInstanceOf(Error);
    expect((captured as Error).message).toMatch(/daemon exited before reporting status/);
    expect((captured as Error).message).toContain('code=2');
    expect(elapsed).toBeLessThan(2_000);
  });
});
