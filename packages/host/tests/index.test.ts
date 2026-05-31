import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, vi } from "vitest";

import {
  GALYARDER_DESIGN_HOST_GLOBAL,
  GALYARDER_DESIGN_HOST_VERSION,
  checkHostUpdater,
  detectGalyarderDesignHostClientType,
  getHostUpdaterStatus,
  getGalyarderDesignHost,
  installHostUpdater,
  isGalyarderDesignHostAvailable,
  isGalyarderDesignHostBridge,
  normalizeGalyarderDesignHostProjectImportResult,
  openHostExternalUrl,
  pickAndImportHostProject,
  printHostPdf,
  openHostProjectPath,
  quitHostAfterUpdaterInstallerOpen,
  setHostPetVisible,
  subscribeHostUpdater,
} from "../src/index.js";
import { createMockGalyarderDesignHost, installMockGalyarderDesignHost } from "../src/testing.js";

const hostRoot = dirname(dirname(fileURLToPath(import.meta.url)));

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return filesUnder(path);
    return /\.(ts|tsx|cts|mts)$/.test(path) ? [path] : [];
  });
}

describe("galyarder-design host contract", () => {
  it("stays independent from daemon/web contracts", () => {
    const pkg = JSON.parse(readFileSync(join(hostRoot, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      optionalDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    expect({
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.optionalDependencies,
      ...pkg.peerDependencies,
    }).not.toHaveProperty("@galyarder-design/contracts");

    const offenders = filesUnder(join(hostRoot, "src")).filter((path) =>
      readFileSync(path, "utf8").includes("@galyarder-design/contracts"),
    );
    expect(offenders).toEqual([]);
  });

  it("recognizes the canonical bridge shape", () => {
    const host = createMockGalyarderDesignHost();
    expect(isGalyarderDesignHostBridge(host)).toBe(true);
    expect(host.version).toBe(GALYARDER_DESIGN_HOST_VERSION);
  });

  it("rejects legacy or incomplete bridge shapes", () => {
    expect(isGalyarderDesignHostBridge({ version: GALYARDER_DESIGN_HOST_VERSION })).toBe(false);
    expect(isGalyarderDesignHostBridge({ ...createMockGalyarderDesignHost(), version: 2 })).toBe(false);
    expect(isGalyarderDesignHostBridge({
      ...createMockGalyarderDesignHost(),
      shell: { openExternal: async () => ({ ok: true }) },
    })).toBe(false);
    expect(isGalyarderDesignHostBridge({
      ...createMockGalyarderDesignHost(),
      updater: { status: async () => createMockGalyarderDesignHost().updater.status() },
    })).toBe(false);
  });

  it("reads the bridge through the package-owned global accessor", () => {
    const scope: Record<string, unknown> = {};
    scope[GALYARDER_DESIGN_HOST_GLOBAL] = createMockGalyarderDesignHost();
    expect(getGalyarderDesignHost(scope)?.client.type).toBe("desktop");
    expect(isGalyarderDesignHostAvailable(scope)).toBe(true);
    expect(detectGalyarderDesignHostClientType(scope)).toBe("desktop");
  });

  it("falls back to web when no host is installed", () => {
    expect(getGalyarderDesignHost({})).toBeNull();
    expect(isGalyarderDesignHostAvailable({})).toBe(false);
    expect(detectGalyarderDesignHostClientType({})).toBe("web");
  });

  it("wraps host action throws into structured failures", async () => {
    const scope: Record<string, unknown> = {};
    scope[GALYARDER_DESIGN_HOST_GLOBAL] = createMockGalyarderDesignHost({
      shell: {
        openPath: vi.fn(async () => {
          throw new Error("failed");
        }),
      },
    });

    await expect(openHostProjectPath("project-1", scope)).resolves.toEqual({
      ok: false,
      reason: "failed",
    });
  });

  it("normalizes privileged project-import results into host-owned identifiers", () => {
    const result = normalizeGalyarderDesignHostProjectImportResult({
      ok: true,
      response: {
        project: {
          id: "project-1",
          name: "Imported project",
          resolvedDir: "/private/path/that-must-not-cross",
        },
        conversationId: "conversation-1",
        entryFile: "index.html",
      },
    });

    expect(result).toEqual({
      ok: true,
      projectId: "project-1",
      conversationId: "conversation-1",
      entryFile: "index.html",
    });
    expect(JSON.stringify(result)).not.toContain("resolvedDir");
  });

  it("preserves canceled and structured failure project-import results", () => {
    expect(normalizeGalyarderDesignHostProjectImportResult({ canceled: true, ok: false })).toEqual({
      canceled: true,
      ok: false,
    });
    expect(normalizeGalyarderDesignHostProjectImportResult({
      ok: false,
      reason: "daemon returned HTTP 500",
      details: { code: "boom" },
    })).toEqual({
      ok: false,
      reason: "daemon returned HTTP 500",
      details: { code: "boom" },
    });
  });

  it("rejects malformed successful project-import results before they reach web callers", () => {
    expect(normalizeGalyarderDesignHostProjectImportResult({
      ok: true,
      response: {
        project: { id: "project-1" },
        conversationId: "conversation-1",
      },
    })).toEqual({
      ok: false,
      reason: "daemon import response did not include host project identifiers",
      details: {
        project: { id: "project-1" },
        conversationId: "conversation-1",
      },
    });
  });

  it("routes all host actions through package-owned helpers", async () => {
    const openExternal = vi.fn(async () => ({ ok: true as const }));
    const openPath = vi.fn(async () => ({ ok: true as const }));
    const pickAndImport = vi.fn(async () => ({
      ok: true as const,
      projectId: "project-2",
      conversationId: "conversation-2",
      entryFile: "app.html",
    }));
    const print = vi.fn(async () => ({ ok: true as const }));
    const setVisible = vi.fn();
    const scope: Record<string, unknown> = {};
    scope[GALYARDER_DESIGN_HOST_GLOBAL] = createMockGalyarderDesignHost({
      shell: { openExternal, openPath },
      project: { pickAndImport },
      pdf: { print },
      pet: { setVisible },
    });

    await expect(openHostExternalUrl("https://example.com", scope)).resolves.toEqual({ ok: true });
    await expect(openHostProjectPath("project-2", scope)).resolves.toEqual({ ok: true });
    await expect(pickAndImportHostProject({ skillId: "skill-1" }, scope)).resolves.toMatchObject({
      ok: true,
      projectId: "project-2",
    });
    await expect(printHostPdf("<html></html>", "nonce", { deck: true }, scope)).resolves.toEqual({ ok: true });
    expect(setHostPetVisible(true, scope)).toEqual({ ok: true });

    expect(openExternal).toHaveBeenCalledWith("https://example.com");
    expect(openPath).toHaveBeenCalledWith("project-2");
    expect(pickAndImport).toHaveBeenCalledWith({ skillId: "skill-1" });
    expect(print).toHaveBeenCalledWith("<html></html>", "nonce", { deck: true });
    expect(setVisible).toHaveBeenCalledWith(true);
  });

  it("routes updater status, actions, and subscriptions through package-owned helpers", async () => {
    const status = {
      arch: "arm64",
      availableVersion: "1.0.1-beta.1",
      capabilities: {
        canApplyInPlace: false,
        canDownload: true,
        canOpenInstaller: true,
        requiresManualInstall: true,
      },
      channel: "beta" as const,
      currentVersion: "1.0.0-beta.0",
      downloadPath: "/tmp/Galyarder Design Beta.dmg",
      enabled: true,
      mode: "package-launcher" as const,
      platform: "darwin",
      state: "downloaded" as const,
      supported: true,
    };
    const check = vi.fn(async () => status);
    const install = vi.fn(async () => status);
    const quit = vi.fn(async () => ({ ok: true as const }));
    const statusFn = vi.fn(async () => status);
    const unsubscribe = vi.fn();
    const subscribe = vi.fn(() => unsubscribe);
    const scope: Record<string, unknown> = {};
    scope[GALYARDER_DESIGN_HOST_GLOBAL] = createMockGalyarderDesignHost({
      updater: { check, install, quit, status: statusFn, subscribe },
    });

    await expect(getHostUpdaterStatus({ payload: { source: "mount" } }, scope)).resolves.toEqual({
      ok: true,
      status,
    });
    await expect(checkHostUpdater({ payload: { source: "button" } }, scope)).resolves.toEqual({
      ok: true,
      status,
    });
    await expect(installHostUpdater({ payload: { source: "popup" } }, scope)).resolves.toEqual({
      ok: true,
      status,
    });
    await expect(quitHostAfterUpdaterInstallerOpen({ payload: { source: "opened-popup" } }, scope)).resolves.toEqual({
      ok: true,
    });

    const listener = vi.fn();
    expect(subscribeHostUpdater(listener, scope)).toBe(unsubscribe);
    expect(statusFn).toHaveBeenCalledWith({ payload: { source: "mount" } });
    expect(check).toHaveBeenCalledWith({ payload: { source: "button" } });
    expect(install).toHaveBeenCalledWith({ payload: { source: "popup" } });
    expect(quit).toHaveBeenCalledWith({ payload: { source: "opened-popup" } });
    expect(subscribe).toHaveBeenCalledWith(listener);
  });

  it("wraps updater action throws into structured failures", async () => {
    const scope: Record<string, unknown> = {};
    scope[GALYARDER_DESIGN_HOST_GLOBAL] = createMockGalyarderDesignHost({
      updater: {
        check: vi.fn(async () => {
          throw new Error("updater failed");
        }),
      },
    });

    await expect(checkHostUpdater(undefined, scope)).resolves.toEqual({
      ok: false,
      reason: "updater failed",
    });
  });

  it("installs and restores test hosts without exposing callers to the global key", () => {
    const scope: Record<string, unknown> = {};
    const restore = installMockGalyarderDesignHost({ scope });
    expect(getGalyarderDesignHost(scope)).not.toBeNull();
    restore();
    expect(getGalyarderDesignHost(scope)).toBeNull();
  });
});
