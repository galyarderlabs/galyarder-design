import {
  GALYARDER_DESIGN_HOST_GLOBAL,
  GALYARDER_DESIGN_HOST_VERSION,
  type GalyarderDesignHostBridge,
  type GalyarderDesignHostGlobalScope,
  type GalyarderDesignHostUpdaterStatusSnapshot,
} from "./index.js";

export type MockGalyarderDesignHost = Partial<Omit<GalyarderDesignHostBridge, "client" | "pdf" | "pet" | "project" | "shell" | "updater">> & {
  client?: Partial<GalyarderDesignHostBridge["client"]>;
  pdf?: Partial<GalyarderDesignHostBridge["pdf"]>;
  pet?: Partial<GalyarderDesignHostBridge["pet"]>;
  project?: Partial<GalyarderDesignHostBridge["project"]>;
  shell?: Partial<GalyarderDesignHostBridge["shell"]>;
  updater?: Partial<GalyarderDesignHostBridge["updater"]>;
};

export type MockGalyarderDesignHostOptions = {
  host?: MockGalyarderDesignHost;
  scope?: GalyarderDesignHostGlobalScope;
};

function defaultHost(): GalyarderDesignHostBridge {
  const updaterStatus: GalyarderDesignHostUpdaterStatusSnapshot = {
    arch: "arm64",
    capabilities: {
      canApplyInPlace: false,
      canDownload: true,
      canOpenInstaller: true,
      requiresManualInstall: true,
    },
    channel: "beta",
    currentVersion: "1.0.0-beta.0",
    enabled: true,
    mode: "package-launcher",
    platform: "darwin",
    state: "idle",
    supported: true,
  };
  return {
    version: GALYARDER_DESIGN_HOST_VERSION,
    client: {
      type: "desktop",
      platform: "test",
    },
    shell: {
      openExternal: async () => ({ ok: true }),
      openPath: async () => ({ ok: true }),
    },
    project: {
      pickAndImport: async () => ({
        ok: true,
        projectId: "project-test",
        conversationId: "conversation-test",
        entryFile: "index.html",
      }),
      pickAndReplaceWorkingDir: async () => ({
        ok: true,
        baseDir: "/tmp/galyarder-design-test",
        entryFile: null,
      }),
    },
    pdf: {
      print: async () => ({ ok: true }),
    },
    pet: {
      setVisible: () => undefined,
    },
    updater: {
      check: async () => updaterStatus,
      download: async () => updaterStatus,
      install: async () => updaterStatus,
      quit: async () => ({ ok: true }),
      status: async () => updaterStatus,
      subscribe: () => () => undefined,
    },
  };
}

export function createMockGalyarderDesignHost(overrides: MockGalyarderDesignHost = {}): GalyarderDesignHostBridge {
  const base = defaultHost();
  return {
    ...base,
    ...overrides,
    client: { ...base.client, ...overrides.client },
    shell: { ...base.shell, ...overrides.shell },
    project: { ...base.project, ...overrides.project },
    pdf: { ...base.pdf, ...overrides.pdf },
    pet: { ...base.pet, ...overrides.pet },
    updater: { ...base.updater, ...overrides.updater },
  };
}

export function installMockGalyarderDesignHost(options: MockGalyarderDesignHostOptions = {}): () => void {
  const scope = (options.scope ?? globalThis) as GalyarderDesignHostGlobalScope;
  const host = createMockGalyarderDesignHost(options.host);
  const windowValue = scope.window;
  const targets = [
    scope,
    ...(typeof windowValue === "object" && windowValue != null && windowValue !== scope
      ? [windowValue as GalyarderDesignHostGlobalScope]
      : []),
  ];
  const previous = targets.map((target) => ({
    had: Object.prototype.hasOwnProperty.call(target, GALYARDER_DESIGN_HOST_GLOBAL),
    target,
    value: target[GALYARDER_DESIGN_HOST_GLOBAL],
  }));

  for (const target of targets) {
    Object.defineProperty(target, GALYARDER_DESIGN_HOST_GLOBAL, {
      configurable: true,
      value: host,
      writable: true,
    });
  }

  return () => {
    for (const entry of previous) {
      if (entry.had) {
        Object.defineProperty(entry.target, GALYARDER_DESIGN_HOST_GLOBAL, {
          configurable: true,
          value: entry.value,
          writable: true,
        });
      } else {
        delete entry.target[GALYARDER_DESIGN_HOST_GLOBAL];
      }
    }
  };
}
