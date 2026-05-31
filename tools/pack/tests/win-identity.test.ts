import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { resolveWinInstallIdentity } from "../src/win/identity.js";

describe("resolveWinInstallIdentity", () => {
  it("keeps the default namespace on the canonical Windows display name", () => {
    expect(resolveWinInstallIdentity({ namespace: "default" })).toMatchObject({
      displayName: "Galyarder Design",
      shortcutName: "Galyarder Design.lnk",
      uninstallerName: "Uninstall Galyarder Design.exe",
    });
  });

  it("uses the canonical Windows display name for stable release namespaces", () => {
    expect(resolveWinInstallIdentity({ namespace: "release-stable-win" })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Galyarder Design.exe",
      displayName: "Galyarder Design",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Galyarder Design-release-stable-win",
      shortcutName: "Galyarder Design.lnk",
      uninstallerName: "Uninstall Galyarder Design.exe",
    });
  });

  it("uses first-class beta display identity for beta release namespaces", () => {
    expect(resolveWinInstallIdentity({ namespace: "release-beta-win" })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Galyarder Design Beta.exe",
      displayName: "Galyarder Design Beta",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Galyarder Design-release-beta-win",
      shortcutName: "Galyarder Design Beta.lnk",
      uninstallerName: "Uninstall Galyarder Design Beta.exe",
    });
  });

  it("keeps non-release beta-like namespaces isolated from the real beta channel identity", () => {
    expect(resolveWinInstallIdentity({ namespace: "beta-local-flow" })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Galyarder Design beta-local-flow.exe",
      displayName: "Galyarder Design beta-local-flow",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Galyarder Design-beta-local-flow",
      shortcutName: "Galyarder Design beta-local-flow.lnk",
      uninstallerName: "Uninstall Galyarder Design beta-local-flow.exe",
    });
  });

  it("uses first-class preview display identity for preview release namespaces", () => {
    expect(resolveWinInstallIdentity({ namespace: "release-preview-win" })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Galyarder Design Preview.exe",
      displayName: "Galyarder Design Preview",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Galyarder Design-release-preview-win",
      shortcutName: "Galyarder Design Preview.lnk",
      uninstallerName: "Uninstall Galyarder Design Preview.exe",
    });
  });

  it("uses first-class nightly display identity for nightly release versions and namespaces", () => {
    expect(resolveWinInstallIdentity({
      appVersion: "0.8.0.nightly.2",
      namespace: "release-stable-win",
    })).toMatchObject({
      appPathsKey: "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Galyarder Design Nightly.exe",
      displayName: "Galyarder Design Nightly",
      registryKey: "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Galyarder Design-release-stable-win",
      shortcutName: "Galyarder Design Nightly.lnk",
      uninstallerName: "Uninstall Galyarder Design Nightly.exe",
    });
    expect(resolveWinInstallIdentity({ namespace: "release-nightly-win" })).toMatchObject({
      displayName: "Galyarder Design Nightly",
      shortcutName: "Galyarder Design Nightly.lnk",
    });
  });

  it("keeps the registry DisplayName free of the package version", async () => {
    const source = await readFile(new URL("../src/win/custom-installer.ts", import.meta.url), "utf8");
    expect(source).toContain('WriteRegStr HKCU "${registryKey}" "DisplayName" "${productName}"');
    expect(source).not.toContain('"DisplayName" "${productName} \\${APP_VERSION}"');
  });

  it("checks the silent install target directory for running instances before overwriting files", async () => {
    const source = await readFile(new URL("../src/win/custom-installer.ts", import.meta.url), "utf8");
    const silentCheck = source.slice(source.indexOf("silent_check:"), source.indexOf("IfFileExists \"$INSTDIR\\\\${exeName}\" existing_install"));
    expect(silentCheck).toContain('IfFileExists "$INSTDIR\\\\${exeName}" 0 silent_detect_running_instances');
    expect(silentCheck).toContain('StrCpy $RunningInstancesInstallRoot "$INSTDIR"');
    expect(silentCheck.indexOf('StrCpy $RunningInstancesInstallRoot "$INSTDIR"')).toBeLessThan(
      silentCheck.indexOf("Call DetectRunningInstances"),
    );
  });
});
