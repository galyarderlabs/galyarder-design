import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GalyarderDesignHostUpdaterStatusSnapshot } from '@galyarder-design/host';

import {
  Badge,
  Banner,
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Progress,
  Spinner,
} from './ds/index';
import {
  deriveUpdaterModel,
  openUpdaterInstaller,
  quitAfterUpdaterInstallerOpen,
  readUpdaterStatus,
  subscribeToUpdaterStatus,
  type UpdaterModel,
} from '../lib/updater';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';
import { useAnalytics, useAppVersion } from '../analytics/provider';
import {
  trackUpdateIndicatorClick,
  trackUpdateIndicatorSurfaceView,
  trackUpdateInstallResult,
  trackUpdatePromptSurfaceView,
} from '../analytics/events';

const INSTALL_HANDOFF_WATCHDOG_MS = 10_000;

type InstallState = 'idle' | 'opening' | 'handoff' | 'recoverable';
type Translator = (key: keyof Dict, vars?: Record<string, string | number>) => string;

function versionText(t: Translator, model: UpdaterModel): string {
  const version = model.availableVersion;
  return version == null ? t('updater.readyGeneric') : t('updater.readyVersion', { version });
}

function channelLabelFor(channel: string | null | undefined): string | null {
  switch (channel) {
    case 'beta':
      return 'Beta channel';
    case 'nightly':
      return 'Nightly channel';
    case 'preview':
      return 'Preview channel';
    case 'stable':
      return 'Stable channel';
    default:
      return null;
  }
}

function updateVersionProps(model: UpdaterModel, appVersionBefore: string | null) {
  return {
    ...(appVersionBefore ? { app_version_before: appVersionBefore } : {}),
    ...(model.availableVersion ? { app_version_after: model.availableVersion } : {}),
  };
}

function updaterErrorCode(model: UpdaterModel): string | undefined {
  return model.status?.error?.code;
}

/**
 * Desktop update indicator + install prompt. Renders a trigger button in the
 * nav rail and a Dialog panel with version badge, progress, and install action.
 * Zero-prop component — all state is internal.
 *
 * @example
 *   <UpdaterPopup />
 */
export function UpdaterPopup() {
  const t = useT();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const actionInFlightRef = useRef(false);
  const handoffWatchdogRef = useRef<number | null>(null);
  const [model, setModel] = useState<UpdaterModel>(() => deriveUpdaterModel(null));
  const [panelOpen, setPanelOpen] = useState(false);
  const [installState, setInstallState] = useState<InstallState>('idle');

  const clearHandoffWatchdog = useCallback(() => {
    if (handoffWatchdogRef.current == null) return;
    window.clearTimeout(handoffWatchdogRef.current);
    handoffWatchdogRef.current = null;
  }, []);

  const recoverFromInstallerHandoff = useCallback(() => {
    handoffWatchdogRef.current = null;
    actionInFlightRef.current = false;
    setInstallState('recoverable');
    setPanelOpen(true);
  }, []);

  const startHandoffWatchdog = useCallback(() => {
    clearHandoffWatchdog();
    // The quit IPC can resolve before Electron has actually torn down the
    // renderer. Keep the handoff UI up, but do not leave it stuck forever.
    handoffWatchdogRef.current = window.setTimeout(recoverFromInstallerHandoff, INSTALL_HANDOFF_WATCHDOG_MS);
  }, [clearHandoffWatchdog, recoverFromInstallerHandoff]);

  useEffect(() => clearHandoffWatchdog, [clearHandoffWatchdog]);

  useEffect(() => {
    let mounted = true;
    const applyStatus = (status: GalyarderDesignHostUpdaterStatusSnapshot) => {
      if (!mounted) return;
      setModel(deriveUpdaterModel(status, { hostAvailable: true }));
    };
    const unsubscribe = subscribeToUpdaterStatus(applyStatus);
    void readUpdaterStatus({ payload: { source: 'updater-indicator:mount' } }).then((result) => {
      if (!mounted) return;
      if (result.ok) {
        setModel(result.model);
      } else {
        setModel(deriveUpdaterModel(null, { hostAvailable: false }));
      }
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const ready = model.environment === 'desktop' && model.shouldShowControl;
  const installBusy = installState === 'opening' || installState === 'handoff';
  const canStartInstall = ready || installState === 'recoverable';
  const showControl = ready || installState !== 'idle';
  const controlLabel = t('updater.openInstaller');
  const channelLabel = channelLabelFor(model.status?.channel);
  const analytics = useAnalytics();
  const appVersionBefore = useAppVersion();
  const versionProps = useMemo(
    () => updateVersionProps(model, appVersionBefore),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appVersionBefore, model.availableVersion],
  );

  const indicatorSurfaceKey = `${model.currentVersion ?? 'unknown'}->${model.availableVersion ?? 'unknown'}:${model.status?.downloadPath ?? 'unknown'}`;
  const lastIndicatorSurfaceKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!ready) {
      lastIndicatorSurfaceKeyRef.current = null;
      return;
    }
    if (lastIndicatorSurfaceKeyRef.current === indicatorSurfaceKey) return;
    lastIndicatorSurfaceKeyRef.current = indicatorSurfaceKey;
    trackUpdateIndicatorSurfaceView(analytics.track, {
      page_name: 'home',
      area: 'update_indicator',
      ...versionProps,
    });
  }, [analytics.track, indicatorSurfaceKey, ready, versionProps]);

  const promptSurfaceKey = panelOpen ? indicatorSurfaceKey : null;
  const lastPromptSurfaceKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (promptSurfaceKey == null) {
      lastPromptSurfaceKeyRef.current = null;
      return;
    }
    if (lastPromptSurfaceKeyRef.current === promptSurfaceKey) return;
    lastPromptSurfaceKeyRef.current = promptSurfaceKey;
    trackUpdatePromptSurfaceView(analytics.track, {
      page_name: 'home',
      area: 'update_prompt',
      ...versionProps,
    });
  }, [analytics.track, promptSurfaceKey, versionProps]);

  const close = useCallback(() => {
    if (installBusy) return;
    trackUpdateIndicatorClick(analytics.track, {
      page_name: 'home',
      area: 'update_prompt',
      element: 'later',
      action: 'dismiss',
      ...versionProps,
    });
    setPanelOpen(false);
  }, [analytics.track, installBusy, versionProps]);

  const installAndQuit = async () => {
    if (actionInFlightRef.current || !canStartInstall) return;
    actionInFlightRef.current = true;
    clearHandoffWatchdog();
    setInstallState('opening');
    setPanelOpen(true);
    trackUpdateIndicatorClick(analytics.track, {
      page_name: 'home',
      area: 'update_prompt',
      element: 'install_update',
      action: 'install',
      ...versionProps,
    });
    try {
      const result = await openUpdaterInstaller({ payload: { source: 'updater-prompt' } });
      if (!result.ok) {
        actionInFlightRef.current = false;
        setInstallState('idle');
        trackUpdateInstallResult(analytics.track, {
          page_name: 'home',
          area: 'update_prompt',
          result: 'failed',
          error_code: result.reason,
          ...versionProps,
        });
        return;
      }
      if (result.model.errorMessage != null) {
        actionInFlightRef.current = false;
        setInstallState('idle');
        trackUpdateInstallResult(analytics.track, {
          page_name: 'home',
          area: 'update_prompt',
          result: 'failed',
          ...(updaterErrorCode(result.model) ? { error_code: updaterErrorCode(result.model) } : {}),
          ...versionProps,
        });
        return;
      }
      setModel(result.model);
      setInstallState('handoff');
      startHandoffWatchdog();
      trackUpdateInstallResult(analytics.track, {
        page_name: 'home',
        area: 'update_prompt',
        result: 'success',
        ...versionProps,
      });
      const quitResult = await quitAfterUpdaterInstallerOpen({ payload: { source: 'updater-prompt' } });
      if (!quitResult.ok) {
        clearHandoffWatchdog();
        actionInFlightRef.current = false;
        setInstallState('recoverable');
        setPanelOpen(true);
      }
    } catch (error) {
      clearHandoffWatchdog();
      actionInFlightRef.current = false;
      setInstallState('idle');
      trackUpdateInstallResult(analytics.track, {
        page_name: 'home',
        area: 'update_prompt',
        result: 'failed',
        error_code: error instanceof Error ? error.name : 'unknown',
        ...versionProps,
      });
    }
  };

  if (!showControl) return null;

  return (
    <>
      {/* Trigger button in the nav rail */}
      <IconButton
        ref={triggerRef}
        aria-disabled={installBusy ? 'true' : undefined}
        aria-expanded={panelOpen}
        aria-label={controlLabel}
        className="entry-nav-rail__btn entry-updater-menu__button is-ready"
        data-testid="entry-nav-updater"
        data-tooltip={controlLabel}
        title={controlLabel}
        variant="plain"
        onClick={() => {
          if (installBusy) return;
          if (panelOpen) {
            setPanelOpen(false);
            return;
          }
          trackUpdateIndicatorClick(analytics.track, {
            page_name: 'home',
            area: 'update_indicator',
            element: 'ready_indicator',
            action: 'open_prompt',
            ...versionProps,
          });
          setPanelOpen(true);
        }}
      >
        <Icon name="ArrowUp" size={20} strokeWidth={1.5} />
      </IconButton>

      {/* Update prompt dialog */}
      <Dialog open={panelOpen} onOpenChange={(open) => { if (!open && !installBusy) close(); }}>
        <DialogContent
          size="sm"
          dismissable={!installBusy}
          data-testid="updater-popup"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          {/* Header row: title + close button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <DialogTitle
                style={{ font: 'var(--type-h3)', color: 'var(--text-strong)' }}
              >
                {t('updater.ready')}
              </DialogTitle>

              {/* Version badge + channel label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  flexWrap: 'wrap',
                }}
              >
                {model.availableVersion != null ? (
                  <Badge variant="info" size="sm">
                    v{model.availableVersion}
                  </Badge>
                ) : null}
                {channelLabel != null ? (
                  <Badge variant="neutral" size="sm">
                    {channelLabel}
                  </Badge>
                ) : null}
              </div>
            </div>

            {/* Close / dismiss button — Radix DialogClose handles Esc + focus return */}
            <DialogClose asChild>
              <IconButton
                aria-label={t('common.close')}
                disabled={installBusy}
                size="sm"
                variant="plain"
              >
                <Icon name="X" size={16} strokeWidth={1.5} />
              </IconButton>
            </DialogClose>
          </div>

          {/* Version description text */}
          <Card
            elevation="flat"
            padding="sm"
            style={{
              font: 'var(--type-body-sm)',
              color: 'var(--text-muted)',
            }}
          >
            {versionText(t, model)}
          </Card>

          {/* Handoff / opening progress */}
          {installState === 'handoff' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  font: 'var(--type-body-sm)',
                  color: 'var(--text-muted)',
                }}
              >
                <Spinner size="sm" aria-label={t('updater.quitting')} />
                <span>{t('updater.quitting')}</span>
              </div>
              <Progress aria-label={t('updater.quitting')} />
            </div>
          ) : installState === 'opening' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                font: 'var(--type-body-sm)',
                color: 'var(--text-muted)',
              }}
            >
              <Spinner size="sm" aria-label={t('updater.opening')} />
              <span>{t('updater.opening')}</span>
            </div>
          ) : null}

          {/* Recoverable error banner */}
          {installState === 'recoverable' ? (
            <Banner
              variant="warning"
              description={t('updater.openFailedFallback')}
            />
          ) : null}

          {/* Error from model */}
          {model.errorMessage != null && installState === 'idle' ? (
            <Banner
              variant="danger"
              description={model.errorMessage}
            />
          ) : null}

          {/* Action row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-2)',
            }}
          >
            <DialogClose asChild>
              <Button
                disabled={installBusy}
                size="sm"
                variant="secondary"
                onClick={close}
              >
                {t('updater.later')}
              </Button>
            </DialogClose>
            <Button
              data-testid="updater-install-button"
              disabled={installBusy}
              loading={installBusy}
              size="sm"
              variant="primary"
              onClick={() => { void installAndQuit(); }}
            >
              {installBusy ? t('updater.opening') : t('updater.openInstaller')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
