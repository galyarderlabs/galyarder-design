import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

describe("desktop preload host boundary", () => {
  it("exposes the canonical Galyarder Design host global and diagnostics bridge", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const source = readFileSync(join(here, "../../src/main/preload.cts"), "utf8");
    const exposedGlobals = Array.from(source.matchAll(/contextBridge\.exposeInMainWorld\(([^,\n]+)/g))
      .map((match) => match[1]?.trim());
    const runtimeRequires = Array.from(source.matchAll(/require\((['"][^'"]+['"])\)/g))
      .map((match) => match[1]);

    expect(exposedGlobals).toEqual(["GALYARDER_DESIGN_HOST_GLOBAL", "'galyarderDesignDesktop'"]);
    expect(runtimeRequires).toEqual(["'electron'"]);
    expect(source).toContain("GALYARDER_DESIGN_HOST_GLOBAL");
    expect(source).toContain("exportDiagnostics");
    expect(source).toContain("satisfies GalyarderDesignHostBridge");
    expect(source).toContain("updater");
    // OS locale forwarded from main via webPreferences.additionalArguments
    // is mirrored onto __od__.client.osLocale. Pin the literal prefix
    // here so it can't drift away from `applyOsLocaleSwitch`/runtime's
    // additionalArguments without the test going red.
    expect(source).toContain("'--gd-os-locale='");
    expect(source).toContain("osLocale");
    expect(source).toContain("invokeUpdater('install'");
    expect(source).toContain("gd:update:quit");
    expect(source).toContain("gd:update:status-changed");
    expect(source).not.toContain("@galyarder-design/contracts");
    expect(source).not.toContain("exposeInMainWorld('electronAPI'");
    expect(source).not.toContain('exposeInMainWorld("__odDesktop"');
    expect(source).not.toContain("exposeInMainWorld('__odDesktop'");
  });
});
