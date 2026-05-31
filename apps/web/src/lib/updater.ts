import {
  GALYARDER_DESIGN_HOST_UPDATER_STATES,
  checkHostUpdater,
  downloadHostUpdater,
  getHostUpdaterStatus,
  installHostUpdater,
  isGalyarderDesignHostAvailable,
  quitHostAfterUpdaterInstallerOpen,
  subscribeHostUpdater,
  type GalyarderDesignHostActionResult,
  type GalyarderDesignHostFailure,
  type GalyarderDesignHostUpdaterActionOptions,
  type GalyarderDesignHostUpdaterResult,
  type GalyarderDesignHostUpdaterStatusListener,
  type GalyarderDesignHostUpdaterStatusSnapshot,
} from '@galyarder-design/host';

export type UpdaterEnvironment = 'desktop' | 'web';

export type UpdaterDownloadProgress = {
  percent: number | null;
  receivedBytes: number;
  totalBytes: number | null;
};

export type UpdaterActionResult =
  | { ok: true; model: UpdaterModel; status: GalyarderDesignHostUpdaterStatusSnapshot }
  | GalyarderDesignHostFailure;

export type UpdaterModel = {
  availableVersion: string | null;
  busy: boolean;
  canCheck: boolean;
  canDownload: boolean;
  canOpenInstaller: boolean;
  canQuitAfterInstallerOpen: boolean;
  currentVersion: string | null;
  downloadProgress: UpdaterDownloadProgress | null;
  enabled: boolean;
  environment: UpdaterEnvironment;
  errorMessage: string | null;
  hasDownloadedInstaller: boolean;
  installerOpened: boolean;
  promptKey: string | null;
  upToDate: boolean;
  shouldShowControl: boolean;
  shouldPrompt: boolean;
  status: GalyarderDesignHostUpdaterStatusSnapshot | null;
  supported: boolean;
};

function modelFromHostResult(result: GalyarderDesignHostUpdaterResult): UpdaterActionResult {
  if (!result.ok) return result;
  return {
    ok: true,
    model: deriveUpdaterModel(result.status, { hostAvailable: true }),
    status: result.status,
  };
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function downloadProgressFromStatus(
  status: GalyarderDesignHostUpdaterStatusSnapshot | null,
): UpdaterDownloadProgress | null {
  if (status == null) return null;
  if (status.state !== GALYARDER_DESIGN_HOST_UPDATER_STATES.DOWNLOADING) return null;
  const sourceProgress = status.incoming?.progress ?? status.progress;

  const receivedBytes = Math.max(0, sourceProgress?.receivedBytes ?? 0);
  const totalBytes =
    typeof sourceProgress?.totalBytes === 'number' && sourceProgress.totalBytes > 0
      ? sourceProgress.totalBytes
      : null;
  const percent = totalBytes == null ? null : clampPercent((receivedBytes / totalBytes) * 100);
  return {
    percent,
    receivedBytes,
    totalBytes,
  };
}

export function deriveUpdaterModel(
  status: GalyarderDesignHostUpdaterStatusSnapshot | null,
  options: { hostAvailable?: boolean } = {},
): UpdaterModel {
  const hostAvailable = options.hostAvailable ?? isGalyarderDesignHostAvailable();
  const environment: UpdaterEnvironment = hostAvailable ? 'desktop' : 'web';
  const state = status?.state;
  const busy =
    state === GALYARDER_DESIGN_HOST_UPDATER_STATES.CHECKING ||
    state === GALYARDER_DESIGN_HOST_UPDATER_STATES.DOWNLOADING ||
    state === GALYARDER_DESIGN_HOST_UPDATER_STATES.INSTALLING;
  const canOpenInstaller = Boolean(
    hostAvailable &&
    status?.enabled &&
    status.supported &&
    status.capabilities.canOpenInstaller,
  );
  const hasDownloadedInstaller = Boolean(
    state === GALYARDER_DESIGN_HOST_UPDATER_STATES.DOWNLOADED &&
    status?.downloadPath,
  );
  const installerOpened = status?.installResult != null;
  const availableVersion = status?.availableVersion ?? null;
  const currentVersion = status?.currentVersion ?? null;
  const downloadProgress = downloadProgressFromStatus(status);
  const upToDate = state === GALYARDER_DESIGN_HOST_UPDATER_STATES.NOT_AVAILABLE;
  const promptKey =
    status == null || availableVersion == null
      ? null
      : [
          status.channel,
          currentVersion ?? 'unknown-current',
          availableVersion,
          status.downloadPath ?? status.artifactUrl ?? status.artifact?.url ?? 'unknown-artifact',
        ].join(':');
  const canQuitAfterInstallerOpen = hostAvailable && installerOpened;
  const shouldShowControl = Boolean(canOpenInstaller && hasDownloadedInstaller && !installerOpened);

  return {
    availableVersion,
    busy,
    canCheck: hostAvailable && Boolean(status?.enabled) && !busy,
    canDownload: hostAvailable && Boolean(status?.enabled && status.capabilities.canDownload) && !busy,
    canOpenInstaller,
    canQuitAfterInstallerOpen,
    currentVersion,
    downloadProgress,
    enabled: Boolean(status?.enabled),
    environment,
    errorMessage: status?.error?.message ?? null,
    hasDownloadedInstaller,
    installerOpened,
    promptKey,
    upToDate,
    shouldShowControl,
    shouldPrompt: canOpenInstaller && hasDownloadedInstaller && !installerOpened,
    status,
    supported: Boolean(status?.supported),
  };
}

export async function readUpdaterStatus(options?: GalyarderDesignHostUpdaterActionOptions): Promise<UpdaterActionResult> {
  return modelFromHostResult(await getHostUpdaterStatus(options));
}

export async function checkForUpdaterUpdate(options?: GalyarderDesignHostUpdaterActionOptions): Promise<UpdaterActionResult> {
  return modelFromHostResult(await checkHostUpdater(options));
}

export async function downloadUpdaterUpdate(options?: GalyarderDesignHostUpdaterActionOptions): Promise<UpdaterActionResult> {
  return modelFromHostResult(await downloadHostUpdater(options));
}

export async function openUpdaterInstaller(options?: GalyarderDesignHostUpdaterActionOptions): Promise<UpdaterActionResult> {
  return modelFromHostResult(await installHostUpdater(options));
}

export async function quitAfterUpdaterInstallerOpen(
  options?: GalyarderDesignHostUpdaterActionOptions,
): Promise<GalyarderDesignHostActionResult> {
  return await quitHostAfterUpdaterInstallerOpen(options);
}

export function subscribeToUpdaterStatus(listener: GalyarderDesignHostUpdaterStatusListener): () => void {
  return subscribeHostUpdater(listener);
}
