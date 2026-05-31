import { join } from "node:path";

import { describe, expect, it } from "vitest";

import type { ToolPackConfig } from "../src/config.js";
import { resolveMacInstallIdentity } from "../src/mac/identity.js";
import { resolveMacPaths } from "../src/mac/paths.js";

function makeConfig(root: string, namespace: string): ToolPackConfig {
  return {
    containerized: false,
    electronBuilderCliPath: "/x/electron-builder/cli.js",
    electronDistPath: "/x/electron/dist",
    electronVersion: "41.3.0",
    macCompression: "normal",
    namespace,
    platform: "mac",
    portable: true,
    removeData: false,
    removeLogs: false,
    removeProductUserData: false,
    removeSidecars: false,
    roots: {
      output: {
        appBuilderRoot: join(root, ".tmp", "tools-pack", "out", "mac", "namespaces", namespace, "builder"),
        namespaceRoot: join(root, ".tmp", "tools-pack", "out", "mac", "namespaces", namespace),
        platformRoot: join(root, ".tmp", "tools-pack", "out", "mac"),
        root: join(root, ".tmp", "tools-pack", "out"),
      },
      runtime: {
        namespaceBaseRoot: join(root, ".tmp", "tools-pack", "runtime", "mac", "namespaces"),
        namespaceRoot: join(root, ".tmp", "tools-pack", "runtime", "mac", "namespaces", namespace),
      },
      cacheRoot: join(root, ".tmp", "tools-pack", "cache"),
      toolPackRoot: join(root, ".tmp", "tools-pack"),
    },
    signed: false,
    silent: true,
    to: "dmg",
    webOutputMode: "standalone",
    workspaceRoot: root,
  };
}

describe("resolveMacInstallIdentity", () => {
  it("keeps stable builds on the canonical mac identity", () => {
    expect(resolveMacInstallIdentity(makeConfig("/work", "release-stable"))).toMatchObject({
      appId: "io.galyarder-design.desktop",
      installerTitle: "Galyarder Design",
      productName: "Galyarder Design",
      publicAppBundleName: "Galyarder Design.app",
      systemAppBundleName: "Galyarder Design.app",
    });
  });

  it("uses first-class beta app identity for beta release namespaces", () => {
    const config = makeConfig("/work", "release-beta");

    expect(resolveMacInstallIdentity(config)).toEqual({
      appId: "io.galyarder-design.desktop.beta",
      executableName: "Galyarder Design Beta",
      installerTitle: "Galyarder Design Beta",
      productName: "Galyarder Design Beta",
      publicAppBundleName: "Galyarder Design Beta.app",
      systemAppBundleName: "Galyarder Design Beta.app",
    });
    expect(resolveMacPaths(config).appPath).toMatch(/Galyarder Design Beta\.app$/);
  });

  it("uses first-class preview app identity for preview release namespaces", () => {
    const config = makeConfig("/work", "release-preview");

    expect(resolveMacInstallIdentity(config)).toEqual({
      appId: "io.galyarder-design.desktop.preview",
      executableName: "Galyarder Design Preview",
      installerTitle: "Galyarder Design Preview",
      productName: "Galyarder Design Preview",
      publicAppBundleName: "Galyarder Design Preview.app",
      systemAppBundleName: "Galyarder Design Preview.app",
    });
    expect(resolveMacPaths(config).appPath).toMatch(/Galyarder Design Preview\.app$/);
  });

  it("uses first-class nightly app identity for nightly release versions and namespaces", () => {
    const nightlyVersionConfig = {
      ...makeConfig("/work", "release-stable"),
      appVersion: "0.8.0.nightly.2",
    };
    const nightlyNamespaceConfig = makeConfig("/work", "release-nightly");

    expect(resolveMacInstallIdentity(nightlyVersionConfig)).toEqual({
      appId: "io.galyarder-design.desktop.nightly",
      executableName: "Galyarder Design Nightly",
      installerTitle: "Galyarder Design Nightly",
      productName: "Galyarder Design Nightly",
      publicAppBundleName: "Galyarder Design Nightly.app",
      systemAppBundleName: "Galyarder Design Nightly.app",
    });
    expect(resolveMacPaths(nightlyVersionConfig).appPath).toMatch(/Galyarder Design Nightly\.app$/);
    expect(resolveMacInstallIdentity(nightlyNamespaceConfig)).toMatchObject({
      productName: "Galyarder Design Nightly",
      publicAppBundleName: "Galyarder Design Nightly.app",
    });
  });
});
