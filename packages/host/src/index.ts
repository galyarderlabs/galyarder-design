export const GALYARDER_DESIGN_HOST_GLOBAL = "__od__";
export const GALYARDER_DESIGN_HOST_VERSION = 1;

export const GALYARDER_DESIGN_HOST_CLIENT_TYPES = Object.freeze({
  DESKTOP: "desktop",
} as const);

export type GalyarderDesignHostClientType =
  (typeof GALYARDER_DESIGN_HOST_CLIENT_TYPES)[keyof typeof GALYARDER_DESIGN_HOST_CLIENT_TYPES];

export type GalyarderDesignHostClient = {
  // BCP-47 locale string (e.g. "pt-BR") the host process read from
  // the OS at startup. The renderer uses this so the packaged desktop app
  // can follow the OS language even when Chromium's built-in
  // `navigator.language` would have defaulted to en-US.
  osLocale?: string;
  platform?: string;
  type: GalyarderDesignHostClientType;
};

export type GalyarderDesignHostFailure = {
  details?: unknown;
  ok: false;
  reason: string;
};

export type GalyarderDesignHostActionResult =
  | { ok: true }
  | GalyarderDesignHostFailure;

export type GalyarderDesignHostProjectImportInit = {
  designSystemId?: string | null;
  name?: string;
  skillId?: string | null;
};

export type GalyarderDesignHostProjectImportSuccess = {
  conversationId: string;
  entryFile: string;
  ok: true;
  projectId: string;
};

export type GalyarderDesignHostProjectImportResult =
  | GalyarderDesignHostProjectImportSuccess
  | {
      canceled: true;
      ok: false;
    }
  | GalyarderDesignHostFailure;

export type GalyarderDesignHostProjectReplaceWorkingDirSuccess = {
  baseDir: string;
  entryFile: string | null;
  ok: true;
};

export type GalyarderDesignHostProjectReplaceWorkingDirResult =
  | GalyarderDesignHostProjectReplaceWorkingDirSuccess
  | {
      canceled: true;
      ok: false;
    }
  | GalyarderDesignHostFailure;

export type GalyarderDesignHostPdfPrintOptions = {
  deck?: boolean;
};

export const GALYARDER_DESIGN_HOST_UPDATER_ACTIONS = Object.freeze({
  CHECK: "check",
  DOWNLOAD: "download",
  INSTALL: "install",
  QUIT: "quit",
  STATUS: "status",
} as const);

export type GalyarderDesignHostUpdaterAction =
  (typeof GALYARDER_DESIGN_HOST_UPDATER_ACTIONS)[keyof typeof GALYARDER_DESIGN_HOST_UPDATER_ACTIONS];
type GalyarderDesignHostUpdaterStatusAction = Exclude<
  GalyarderDesignHostUpdaterAction,
  typeof GALYARDER_DESIGN_HOST_UPDATER_ACTIONS.QUIT
>;

export const GALYARDER_DESIGN_HOST_UPDATER_STATES = Object.freeze({
  AVAILABLE: "available",
  CHECKING: "checking",
  DOWNLOADED: "downloaded",
  DOWNLOADING: "downloading",
  ERROR: "error",
  IDLE: "idle",
  INSTALLING: "installing",
  NOT_AVAILABLE: "not-available",
  UNSUPPORTED: "unsupported",
} as const);

export type GalyarderDesignHostUpdaterState =
  (typeof GALYARDER_DESIGN_HOST_UPDATER_STATES)[keyof typeof GALYARDER_DESIGN_HOST_UPDATER_STATES];

export type GalyarderDesignHostUpdaterMode = "js-incremental" | "package-launcher";
export type GalyarderDesignHostUpdaterChannel = "beta" | "nightly" | "preview" | "stable";

export type GalyarderDesignHostUpdaterActionOptions = {
  payload?: Record<string, unknown>;
};

export type GalyarderDesignHostUpdaterCapabilitySet = {
  canApplyInPlace: boolean;
  canDownload: boolean;
  canOpenInstaller: boolean;
  requiresManualInstall: boolean;
};

export type GalyarderDesignHostUpdaterPathSnapshot = {
  downloadRoot?: string;
  manifestPath?: string;
};

export type GalyarderDesignHostUpdaterChecksumSnapshot = {
  algorithm: "sha256" | "sha512";
  url?: string;
  value?: string;
};

export type GalyarderDesignHostUpdaterArtifactSnapshot = {
  name?: string;
  platformKey?: string;
  size?: number;
  type?: string;
  url: string;
};

export type GalyarderDesignHostUpdaterProgressSnapshot = {
  receivedBytes: number;
  totalBytes?: number;
};

export type GalyarderDesignHostUpdaterErrorSnapshot = {
  code: string;
  details?: unknown;
  message: string;
};

export type GalyarderDesignHostUpdaterInstallResult = {
  dryRun?: boolean;
  openedAt: string;
  path: string;
};

export type GalyarderDesignHostUpdaterReleaseSnapshot = {
  arch: string;
  artifact: GalyarderDesignHostUpdaterArtifactSnapshot;
  checksum: GalyarderDesignHostUpdaterChecksumSnapshot;
  channel: GalyarderDesignHostUpdaterChannel;
  downloadedAt: string;
  key: string;
  metadata?: Record<string, unknown>;
  path: string;
  platformKey: string;
  version: string;
};

export type GalyarderDesignHostUpdaterIncomingSnapshot = {
  arch: string;
  artifact: GalyarderDesignHostUpdaterArtifactSnapshot;
  channel: GalyarderDesignHostUpdaterChannel;
  key?: string;
  metadata?: Record<string, unknown>;
  progress?: GalyarderDesignHostUpdaterProgressSnapshot;
  startedAt: string;
  version: string;
};

export type GalyarderDesignHostUpdaterStatusSnapshot = {
  active?: GalyarderDesignHostUpdaterReleaseSnapshot;
  arch: string;
  artifact?: GalyarderDesignHostUpdaterArtifactSnapshot;
  artifactUrl?: string;
  availableVersion?: string;
  capabilities: GalyarderDesignHostUpdaterCapabilitySet;
  channel: GalyarderDesignHostUpdaterChannel;
  checksum?: GalyarderDesignHostUpdaterChecksumSnapshot;
  currentVersion: string;
  downloadPath?: string;
  enabled: boolean;
  error?: GalyarderDesignHostUpdaterErrorSnapshot;
  incoming?: GalyarderDesignHostUpdaterIncomingSnapshot;
  installResult?: GalyarderDesignHostUpdaterInstallResult;
  lastCheckedAt?: string;
  metadata?: Record<string, unknown>;
  mode: GalyarderDesignHostUpdaterMode;
  paths?: GalyarderDesignHostUpdaterPathSnapshot;
  platform: string;
  progress?: GalyarderDesignHostUpdaterProgressSnapshot;
  state: GalyarderDesignHostUpdaterState;
  supported: boolean;
};

export type GalyarderDesignHostUpdaterResult =
  | { ok: true; status: GalyarderDesignHostUpdaterStatusSnapshot }
  | GalyarderDesignHostFailure;

export type GalyarderDesignHostUpdaterStatusListener = (status: GalyarderDesignHostUpdaterStatusSnapshot) => void;

export type GalyarderDesignHostBridge = {
  client: GalyarderDesignHostClient;
  pdf: {
    print(html: string, nonce?: string, options?: GalyarderDesignHostPdfPrintOptions): Promise<GalyarderDesignHostActionResult>;
  };
  pet: {
    setVisible(visible: boolean): void;
  };
  project: {
    pickAndImport(init?: GalyarderDesignHostProjectImportInit): Promise<GalyarderDesignHostProjectImportResult>;
    pickAndReplaceWorkingDir(projectId: string): Promise<GalyarderDesignHostProjectReplaceWorkingDirResult>;
  };
  shell: {
    openExternal(url: string): Promise<GalyarderDesignHostActionResult>;
    openPath(projectId: string): Promise<GalyarderDesignHostActionResult>;
  };
  updater: {
    check(options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostUpdaterStatusSnapshot>;
    download(options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostUpdaterStatusSnapshot>;
    install(options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostUpdaterStatusSnapshot>;
    quit(options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostActionResult>;
    status(options?: GalyarderDesignHostUpdaterActionOptions): Promise<GalyarderDesignHostUpdaterStatusSnapshot>;
    subscribe(listener: GalyarderDesignHostUpdaterStatusListener): () => void;
  };
  version: typeof GALYARDER_DESIGN_HOST_VERSION;
};

export type GalyarderDesignHostGlobalScope = Record<string, unknown> & {
  window?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function failure(reason: string, details?: unknown): GalyarderDesignHostFailure {
  return {
    ...(details === undefined ? {} : { details }),
    ok: false,
    reason,
  };
}

function hasFunction(record: Record<string, unknown>, key: string): boolean {
  return typeof record[key] === "function";
}

export function isGalyarderDesignHostBridge(value: unknown): value is GalyarderDesignHostBridge {
  if (!isRecord(value)) return false;
  if (value.version !== GALYARDER_DESIGN_HOST_VERSION) return false;
  const client = value.client;
  if (!isRecord(client) || client.type !== GALYARDER_DESIGN_HOST_CLIENT_TYPES.DESKTOP) return false;
  if (client.platform != null && typeof client.platform !== "string") return false;
  if (client.osLocale != null && typeof client.osLocale !== "string") return false;

  const shell = value.shell;
  if (!isRecord(shell) || !hasFunction(shell, "openExternal") || !hasFunction(shell, "openPath")) return false;

  const project = value.project;
  if (
    !isRecord(project) ||
    !hasFunction(project, "pickAndImport") ||
    !hasFunction(project, "pickAndReplaceWorkingDir")
  ) {
    return false;
  }

  const pdf = value.pdf;
  if (!isRecord(pdf) || !hasFunction(pdf, "print")) return false;

  const pet = value.pet;
  if (!isRecord(pet) || !hasFunction(pet, "setVisible")) return false;

  const updater = value.updater;
  if (
    !isRecord(updater) ||
    !hasFunction(updater, "status") ||
    !hasFunction(updater, "check") ||
    !hasFunction(updater, "download") ||
    !hasFunction(updater, "install") ||
    !hasFunction(updater, "quit") ||
    !hasFunction(updater, "subscribe")
  ) {
    return false;
  }

  return true;
}

/**
 * Converts a privileged host adapter's raw project-import result into the
 * host-owned renderer contract. The adapter may internally call daemon APIs,
 * but only project identifiers cross the host bridge.
 */
export function normalizeGalyarderDesignHostProjectImportResult(input: unknown): GalyarderDesignHostProjectImportResult {
  if (!isRecord(input)) {
    return failure("desktop import returned an invalid response", input);
  }
  if (input.ok !== true) {
    if (input.canceled === true) return { canceled: true, ok: false };
    const reason = typeof input.reason === "string" && input.reason.length > 0
      ? input.reason
      : "unknown failure";
    return failure(reason, input.details);
  }

  const response = input.response;
  if (!isRecord(response)) {
    return failure("daemon import response was not an object", response);
  }
  const project = response.project;
  const rawProjectId = isRecord(project) ? project.id : null;
  const projectId = typeof rawProjectId === "string" ? rawProjectId : null;
  const conversationId = typeof response.conversationId === "string" ? response.conversationId : null;
  const entryFile = typeof response.entryFile === "string" ? response.entryFile : null;
  if (projectId == null || conversationId == null || entryFile == null) {
    return failure("daemon import response did not include host project identifiers", response);
  }

  return {
    conversationId,
    entryFile,
    ok: true,
    projectId,
  };
}

export function normalizeGalyarderDesignHostProjectReplaceWorkingDirResult(
  input: unknown,
): GalyarderDesignHostProjectReplaceWorkingDirResult {
  if (!isRecord(input)) {
    return failure("desktop working-dir replace returned an invalid response", input);
  }
  if (input.ok !== true) {
    if (input.canceled === true) return { canceled: true, ok: false };
    const reason = typeof input.reason === "string" && input.reason.length > 0
      ? input.reason
      : "unknown failure";
    return failure(reason, input.details);
  }

  const response = input.response;
  if (!isRecord(response)) {
    return failure("daemon working-dir response was not an object", response);
  }
  const baseDir = typeof response.baseDir === "string" ? response.baseDir : null;
  const entryFile = typeof response.entryFile === "string" ? response.entryFile : null;
  if (baseDir == null) {
    return failure("daemon working-dir response did not include baseDir", response);
  }

  return { baseDir, entryFile, ok: true };
}

function candidateFromScope(scope: GalyarderDesignHostGlobalScope): unknown {
  if (GALYARDER_DESIGN_HOST_GLOBAL in scope) return scope[GALYARDER_DESIGN_HOST_GLOBAL];
  const windowValue = scope.window;
  if (isRecord(windowValue) && GALYARDER_DESIGN_HOST_GLOBAL in windowValue) {
    return windowValue[GALYARDER_DESIGN_HOST_GLOBAL];
  }
  return undefined;
}

export function getGalyarderDesignHost(scope: GalyarderDesignHostGlobalScope = globalThis): GalyarderDesignHostBridge | null {
  const candidate = candidateFromScope(scope);
  return isGalyarderDesignHostBridge(candidate) ? candidate : null;
}

export function isGalyarderDesignHostAvailable(scope: GalyarderDesignHostGlobalScope = globalThis): boolean {
  return getGalyarderDesignHost(scope) != null;
}

export function detectGalyarderDesignHostClientType(scope: GalyarderDesignHostGlobalScope = globalThis): GalyarderDesignHostClientType | "web" {
  return getGalyarderDesignHost(scope)?.client.type ?? "web";
}

function unavailable(reason: string): GalyarderDesignHostFailure {
  return failure(reason);
}

export async function openHostExternalUrl(url: string, scope: GalyarderDesignHostGlobalScope = globalThis): Promise<GalyarderDesignHostActionResult> {
  const host = getGalyarderDesignHost(scope);
  if (host == null) return unavailable("Galyarder Design host is not available");
  try {
    return await host.shell.openExternal(url);
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

export async function openHostProjectPath(projectId: string, scope: GalyarderDesignHostGlobalScope = globalThis): Promise<GalyarderDesignHostActionResult> {
  const host = getGalyarderDesignHost(scope);
  if (host == null) return unavailable("Galyarder Design host is not available");
  try {
    return await host.shell.openPath(projectId);
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

export async function pickAndImportHostProject(
  init?: GalyarderDesignHostProjectImportInit,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): Promise<GalyarderDesignHostProjectImportResult> {
  const host = getGalyarderDesignHost(scope);
  if (host == null) return unavailable("Galyarder Design host is not available");
  try {
    return await host.project.pickAndImport(init);
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

export async function pickAndReplaceHostProjectWorkingDir(
  projectId: string,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): Promise<GalyarderDesignHostProjectReplaceWorkingDirResult> {
  const host = getGalyarderDesignHost(scope);
  if (host == null) return unavailable("Galyarder Design host is not available");
  try {
    return await host.project.pickAndReplaceWorkingDir(projectId);
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

export async function printHostPdf(
  html: string,
  nonce?: string,
  options?: GalyarderDesignHostPdfPrintOptions,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): Promise<GalyarderDesignHostActionResult> {
  const host = getGalyarderDesignHost(scope);
  if (host == null) return unavailable("Galyarder Design host is not available");
  try {
    return await host.pdf.print(html, nonce, options);
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

export function setHostPetVisible(visible: boolean, scope: GalyarderDesignHostGlobalScope = globalThis): GalyarderDesignHostActionResult {
  const host = getGalyarderDesignHost(scope);
  if (host == null) return unavailable("Galyarder Design host is not available");
  try {
    host.pet.setVisible(visible);
    return { ok: true };
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

async function runHostUpdaterAction(
  action: GalyarderDesignHostUpdaterStatusAction,
  options?: GalyarderDesignHostUpdaterActionOptions,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): Promise<GalyarderDesignHostUpdaterResult> {
  const host = getGalyarderDesignHost(scope);
  if (host == null) return unavailable("Galyarder Design host is not available");
  try {
    return {
      ok: true,
      status: await host.updater[action](options),
    };
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

export async function getHostUpdaterStatus(
  options?: GalyarderDesignHostUpdaterActionOptions,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): Promise<GalyarderDesignHostUpdaterResult> {
  return await runHostUpdaterAction(GALYARDER_DESIGN_HOST_UPDATER_ACTIONS.STATUS, options, scope);
}

export async function checkHostUpdater(
  options?: GalyarderDesignHostUpdaterActionOptions,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): Promise<GalyarderDesignHostUpdaterResult> {
  return await runHostUpdaterAction(GALYARDER_DESIGN_HOST_UPDATER_ACTIONS.CHECK, options, scope);
}

export async function downloadHostUpdater(
  options?: GalyarderDesignHostUpdaterActionOptions,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): Promise<GalyarderDesignHostUpdaterResult> {
  return await runHostUpdaterAction(GALYARDER_DESIGN_HOST_UPDATER_ACTIONS.DOWNLOAD, options, scope);
}

export async function installHostUpdater(
  options?: GalyarderDesignHostUpdaterActionOptions,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): Promise<GalyarderDesignHostUpdaterResult> {
  return await runHostUpdaterAction(GALYARDER_DESIGN_HOST_UPDATER_ACTIONS.INSTALL, options, scope);
}

export async function quitHostAfterUpdaterInstallerOpen(
  options?: GalyarderDesignHostUpdaterActionOptions,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): Promise<GalyarderDesignHostActionResult> {
  const host = getGalyarderDesignHost(scope);
  if (host == null) return unavailable("Galyarder Design host is not available");
  try {
    return await host.updater.quit(options);
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

export function subscribeHostUpdater(
  listener: GalyarderDesignHostUpdaterStatusListener,
  scope: GalyarderDesignHostGlobalScope = globalThis,
): () => void {
  const host = getGalyarderDesignHost(scope);
  if (host == null) return () => undefined;
  try {
    return host.updater.subscribe(listener);
  } catch {
    return () => undefined;
  }
}
