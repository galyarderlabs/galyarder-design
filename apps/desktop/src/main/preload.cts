const { contextBridge, ipcRenderer } = require('electron');

import type {
  GalyarderDesignHostBridge,
  GalyarderDesignHostActionResult,
  GalyarderDesignHostFailure,
  GalyarderDesignHostProjectImportResult,
  GalyarderDesignHostProjectReplaceWorkingDirResult,
  GalyarderDesignHostUpdaterActionOptions,
  GalyarderDesignHostUpdaterStatusListener,
  GalyarderDesignHostUpdaterStatusSnapshot,
} from '@galyarder-design/host';

const GALYARDER_DESIGN_HOST_GLOBAL: typeof import('@galyarder-design/host').GALYARDER_DESIGN_HOST_GLOBAL = '__od__';
const GALYARDER_DESIGN_HOST_VERSION: typeof import('@galyarder-design/host').GALYARDER_DESIGN_HOST_VERSION = 1;
const UPDATER_STATUS_EVENT = 'gd:update:status-changed';

// Mirror of the argv prefix used by main's `applyOsLocaleSwitch` and
// runtime's `additionalArguments`. Duplicated literal on purpose: the
// preload bundle must not pull in `@galyarder-design/desktop/main` (it
// transitively requires non-electron node modules that the sandboxed
// preload can't load).
const OS_LOCALE_ARG_PREFIX = '--gd-os-locale=';

function readOsLocaleFromArgv(): string | undefined {
  for (const arg of process.argv) {
    if (typeof arg === 'string' && arg.startsWith(OS_LOCALE_ARG_PREFIX)) {
      const value = arg.slice(OS_LOCALE_ARG_PREFIX.length);
      if (value.length === 0) return undefined;
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return undefined;
}

type PrintPdfOptions = {
  deck?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null && !Array.isArray(value);
}

function reasonFromError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function failure(reason: string, details?: unknown): GalyarderDesignHostFailure {
  return {
    ...(details === undefined ? {} : { details }),
    ok: false,
    reason,
  };
}

function actionFailure(reason: string, details?: unknown): GalyarderDesignHostActionResult {
  return failure(reason, details);
}

function importFailure(reason: string): GalyarderDesignHostProjectImportResult {
  return failure(reason);
}

function replaceWorkingDirFailure(reason: string): GalyarderDesignHostProjectReplaceWorkingDirResult {
  return failure(reason);
}

function normalizeProjectReplaceWorkingDirResult(input: unknown): GalyarderDesignHostProjectReplaceWorkingDirResult {
  if (!isRecord(input)) return failure('desktop working-dir replace returned an invalid response', input);
  if (input.ok !== true) {
    if (input.canceled === true) return { canceled: true, ok: false };
    return failure(
      typeof input.reason === 'string' && input.reason.length > 0 ? input.reason : 'unknown failure',
      input.details,
    );
  }

  const response = input.response;
  if (!isRecord(response)) return failure('daemon working-dir response was not an object', response);
  const baseDir = typeof response.baseDir === 'string' ? response.baseDir : null;
  const entryFile =
    typeof response.entryFile === 'string' ? response.entryFile : null;
  if (baseDir == null) {
    return failure('daemon working-dir response did not include baseDir', response);
  }

  return { baseDir, entryFile, ok: true };
}

function normalizeProjectImportResult(input: unknown): GalyarderDesignHostProjectImportResult {
  if (!isRecord(input)) return failure('desktop import returned an invalid response', input);
  if (input.ok !== true) {
    if (input.canceled === true) return { canceled: true, ok: false };
    return failure(
      typeof input.reason === 'string' && input.reason.length > 0 ? input.reason : 'unknown failure',
      input.details,
    );
  }

  const response = input.response;
  if (!isRecord(response)) return failure('daemon import response was not an object', response);
  const project = response.project;
  const rawProjectId = isRecord(project) ? project.id : null;
  const projectId = typeof rawProjectId === 'string' ? rawProjectId : null;
  const conversationId = typeof response.conversationId === 'string' ? response.conversationId : null;
  const entryFile = typeof response.entryFile === 'string' ? response.entryFile : null;
  if (projectId == null || conversationId == null || entryFile == null) {
    return failure('daemon import response did not include host project identifiers', response);
  }

  return {
    conversationId,
    entryFile,
    ok: true,
    projectId,
  };
}

// PR #974 trust boundary. The renderer no longer receives a raw
// filesystem path from the main process: `pickFolder` was deleted from
// this bridge and replaced with `pickAndImport`, which shows the
// folder picker, mints an HMAC token bound to the chosen path, and
// POSTs `/api/import/folder` from the main process — all atomically.
// The renderer only ever sees the host-owned project identifiers or a
// structured error envelope. A compromised renderer cannot name an
// arbitrary baseDir even indirectly because the picker dialog is the
// single source of paths crossing into the daemon, and it lives in the
// main process.

// Keep this file dependency-free at runtime: in sandbox: true preloads only
// the `electron` module is safe to require. The diagnostics channel name is
// duplicated from main/diagnostics.ts on purpose so the preload bundle does
// not pull in node-only modules transitively.
const DESKTOP_DIAGNOSTICS_IPC_CHANNEL = 'diagnostics:export-to-file';

type DesktopDiagnosticsExportResult =
  | { ok: true; path: string }
  | { ok: false; cancelled: true }
  | { ok: false; cancelled: false; message: string };

const project = {
  pickAndImport: (
    init?: { name?: string; skillId?: string | null; designSystemId?: string | null },
  ): Promise<GalyarderDesignHostProjectImportResult> =>
    ipcRenderer.invoke('dialog:pick-and-import', init ?? null)
      .then(normalizeProjectImportResult)
      .catch((error: unknown) => importFailure(reasonFromError(error))),
  pickAndReplaceWorkingDir: (projectId: string): Promise<GalyarderDesignHostProjectReplaceWorkingDirResult> =>
    ipcRenderer.invoke('dialog:pick-and-replace-working-dir', { projectId })
      .then(normalizeProjectReplaceWorkingDirResult)
      .catch((error: unknown) => replaceWorkingDirFailure(reasonFromError(error))),
};

const shell = {
  openExternal: async (url: string): Promise<GalyarderDesignHostActionResult> => {
    try {
      const opened = await ipcRenderer.invoke('shell:open-external', url);
      return opened === true
        ? { ok: true }
        : actionFailure('external URL was not opened');
    } catch (error) {
      return actionFailure(reasonFromError(error));
    }
  },
  // Reveals the named project's working directory in the OS file
  // manager. The renderer passes a project ID; the main process asks
  // the daemon for the canonical resolvedDir and forwards that path
  // (validated) to shell.openPath. For folder-imported projects, the
  // main process additionally requires `metadata.fromTrustedPicker`
  // to be true (set by the HMAC-gated import flow), so renderer code
  // cannot ask the bridge to open arbitrary local paths even
  // indirectly through legacy or future project-creation routes.
  openPath: async (projectId: string): Promise<GalyarderDesignHostActionResult> => {
    try {
      const result = await ipcRenderer.invoke('shell:open-path', projectId);
      if (typeof result === 'string' && result.length > 0) return actionFailure(result);
      return { ok: true };
    } catch (error) {
      return actionFailure(reasonFromError(error));
    }
  },
};

function invokeUpdater(
  action: 'check' | 'download' | 'install' | 'status',
  options?: GalyarderDesignHostUpdaterActionOptions,
): Promise<GalyarderDesignHostUpdaterStatusSnapshot> {
  return ipcRenderer.invoke(`gd:update:${action}`, options ?? null);
}

const updater = {
  check: (options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostUpdaterStatusSnapshot> =>
    invokeUpdater('check', options),
  download: (options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostUpdaterStatusSnapshot> =>
    invokeUpdater('download', options),
  install: (options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostUpdaterStatusSnapshot> =>
    invokeUpdater('install', options),
  quit: async (options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostActionResult> => {
    try {
      return await ipcRenderer.invoke('gd:update:quit', options ?? null);
    } catch (error) {
      return actionFailure(reasonFromError(error));
    }
  },
  status: (options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostUpdaterStatusSnapshot> =>
    invokeUpdater('status', options),
  subscribe: (listener: GalyarderDesignHostUpdaterStatusListener): (() => void) => {
    const handler = (_event: unknown, status: GalyarderDesignHostUpdaterStatusSnapshot): void => {
      listener(status);
    };
    ipcRenderer.on(UPDATER_STATUS_EVENT, handler);
    return () => {
      ipcRenderer.removeListener(UPDATER_STATUS_EVENT, handler);
    };
  },
};

const osLocale = readOsLocaleFromArgv();

const hostBridge = {
  version: GALYARDER_DESIGN_HOST_VERSION,
  client: {
    type: 'desktop',
    platform: process.platform,
    ...(osLocale !== undefined ? { osLocale } : {}),
  },
  shell,
  project,
  pdf: {
    print: async (html: string, nonce?: string, options?: PrintPdfOptions): Promise<GalyarderDesignHostActionResult> => {
      try {
        await ipcRenderer.invoke('gd:print-pdf', html, nonce, options ?? null);
        return { ok: true };
      } catch (error) {
        return actionFailure(reasonFromError(error));
      }
    },
  },
  pet: {
    setVisible: (visible: boolean): void =>
      ipcRenderer.send('desktop-pet:set-visible', Boolean(visible)),
  },
  updater,
} satisfies GalyarderDesignHostBridge;

contextBridge.exposeInMainWorld(GALYARDER_DESIGN_HOST_GLOBAL, hostBridge);

contextBridge.exposeInMainWorld('galyarderDesignDesktop', {
  exportDiagnostics: (): Promise<DesktopDiagnosticsExportResult> =>
    ipcRenderer.invoke(DESKTOP_DIAGNOSTICS_IPC_CHANNEL) as Promise<DesktopDiagnosticsExportResult>,
});
