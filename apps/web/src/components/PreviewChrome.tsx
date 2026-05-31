/**
 * PreviewChrome — single control bar for the Iframe_Preview surface.
 *
 * Provides:
 *   - Zoom `Segmented`  (50 / 75 / 100 / 125 / 150 / 200, default 100)
 *   - Device-frame `Select`  (desktop 1280×800 / tablet 768×1024 / mobile 375×667, default desktop)
 *   - Render-mode `ToggleGroup`  (URL / srcDoc)
 *   - Comment side-panel `IconButton`
 *   - Tweaks panel `IconButton`
 *
 * All transitions ≤ 200 ms (var(--duration-enter)).
 * No remount on toggle — CSS visibility swap only (Req 22.3, 22.6, 22.7).
 *
 * Requirements: 22.1, 22.2, 22.6, 22.7
 */

import { useId } from 'react';
import {
  Segmented,
  SegmentedItem,
  Select,
  SelectItem,
  ToggleGroup,
  ToggleGroupItem,
  IconButton,
} from './ds/index';
import { Icon } from './ds/Icon';
import { useT } from '../i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PreviewZoomLevel = 50 | 75 | 100 | 125 | 150 | 200;
export type PreviewDeviceFrame = 'desktop' | 'tablet' | 'mobile';
export type PreviewRenderMode = 'url' | 'srcdoc';

export interface PreviewChromeProps {
  /** Current zoom level (50–200). Default 100. */
  zoom: PreviewZoomLevel;
  onZoomChange: (zoom: PreviewZoomLevel) => void;

  /** Current device frame. Default 'desktop'. */
  deviceFrame: PreviewDeviceFrame;
  onDeviceFrameChange: (frame: PreviewDeviceFrame) => void;

  /**
   * Current render mode. 'url' = URL-load iframe; 'srcdoc' = srcDoc iframe.
   * The host keeps both iframes mounted simultaneously and swaps CSS
   * visibility — this control never causes a remount.
   */
  renderMode: PreviewRenderMode;
  onRenderModeChange: (mode: PreviewRenderMode) => void;

  /** Whether the comment side-panel is open. */
  commentPanelOpen: boolean;
  onCommentPanelToggle: () => void;

  /** Whether the tweaks panel is open. */
  tweaksPanelOpen: boolean;
  onTweaksPanelToggle: () => void;

  /**
   * When true the render-mode toggle is disabled (e.g. when a bridge
   * feature forces srcDoc and the user cannot switch to URL-load).
   */
  renderModeDisabled?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ZOOM_LEVELS: PreviewZoomLevel[] = [50, 75, 100, 125, 150, 200];

const DEVICE_FRAME_DIMENSIONS: Record<PreviewDeviceFrame, { w: number | null; h: number | null }> = {
  desktop: { w: null, h: null },
  tablet: { w: 768, h: 1024 },
  mobile: { w: 375, h: 667 },
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Single control bar for the Iframe_Preview surface.
 *
 * @example
 *   <PreviewChrome
 *     zoom={100}
 *     onZoomChange={setZoom}
 *     deviceFrame="desktop"
 *     onDeviceFrameChange={setDeviceFrame}
 *     renderMode="url"
 *     onRenderModeChange={setRenderMode}
 *     commentPanelOpen={false}
 *     onCommentPanelToggle={() => setCommentOpen(v => !v)}
 *     tweaksPanelOpen={false}
 *     onTweaksPanelToggle={() => setTweaksOpen(v => !v)}
 *   />
 */
export function PreviewChrome({
  zoom,
  onZoomChange,
  deviceFrame,
  onDeviceFrameChange,
  renderMode,
  onRenderModeChange,
  commentPanelOpen,
  onCommentPanelToggle,
  tweaksPanelOpen,
  onTweaksPanelToggle,
  renderModeDisabled = false,
}: PreviewChromeProps) {
  const t = useT();
  const zoomGroupId = useId();

  return (
    <div className="preview-chrome" role="toolbar" aria-label={t('previewChrome.toolbarAria')}>
      {/* ── Zoom ── */}
      <div className="preview-chrome-group" aria-labelledby={zoomGroupId}>
        <span id={zoomGroupId} className="preview-chrome-group-label">
          {t('previewChrome.zoomLabel')}
        </span>
        <Segmented
          value={String(zoom)}
          onValueChange={(v) => {
            if (!v) return;
            const next = Number(v) as PreviewZoomLevel;
            if (ZOOM_LEVELS.includes(next)) onZoomChange(next);
          }}
          size="sm"
          aria-label={t('previewChrome.zoomAria')}
        >
          {ZOOM_LEVELS.map((level) => (
            <SegmentedItem key={level} value={String(level)}>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{level}%</span>
            </SegmentedItem>
          ))}
        </Segmented>
      </div>

      <span className="preview-chrome-divider" aria-hidden />

      {/* ── Device frame ── */}
      <Select
        value={deviceFrame}
        onValueChange={(v) => onDeviceFrameChange(v as PreviewDeviceFrame)}
        size="sm"
        aria-label={t('previewChrome.deviceFrameAria')}
      >
        <SelectItem value="desktop">
          {t('previewChrome.deviceDesktop')}
          {DEVICE_FRAME_DIMENSIONS.desktop.w === null ? null : (
            <span className="preview-chrome-device-dims" aria-hidden>
              {' '}1280×800
            </span>
          )}
        </SelectItem>
        <SelectItem value="tablet">
          {t('previewChrome.deviceTablet')}
          <span className="preview-chrome-device-dims" aria-hidden>
            {' '}768×1024
          </span>
        </SelectItem>
        <SelectItem value="mobile">
          {t('previewChrome.deviceMobile')}
          <span className="preview-chrome-device-dims" aria-hidden>
            {' '}375×667
          </span>
        </SelectItem>
      </Select>

      <span className="preview-chrome-divider" aria-hidden />

      {/* ── Render mode ── */}
      <ToggleGroup
        type="single"
        value={renderMode}
        onValueChange={(v) => {
          if (!v) return;
          onRenderModeChange(v as PreviewRenderMode);
        }}
        size="sm"
        aria-label={t('previewChrome.renderModeAria')}
        data-disabled={renderModeDisabled ? 'true' : undefined}
        style={renderModeDisabled ? { pointerEvents: 'none', opacity: 'var(--opacity-disabled, 0.4)' } : undefined}
      >
        <ToggleGroupItem value="url" disabled={renderModeDisabled} aria-label={t('previewChrome.renderModeUrl')}>
          {t('previewChrome.renderModeUrl')}
        </ToggleGroupItem>
        <ToggleGroupItem value="srcdoc" disabled={renderModeDisabled} aria-label={t('previewChrome.renderModeSrcdoc')}>
          {t('previewChrome.renderModeSrcdoc')}
        </ToggleGroupItem>
      </ToggleGroup>

      <span className="preview-chrome-divider" aria-hidden />

      {/* ── Comment side-panel ── */}
      <IconButton
        aria-label={t('previewChrome.commentPanelAria')}
        aria-pressed={commentPanelOpen}
        onClick={onCommentPanelToggle}
        size="sm"
        variant={commentPanelOpen ? 'secondary' : 'plain'}
        className={commentPanelOpen ? 'preview-chrome-btn-active' : undefined}
      >
        <Icon name="MessageSquare" size={16} strokeWidth={1.5} />
      </IconButton>

      {/* ── Tweaks panel ── */}
      <IconButton
        aria-label={t('previewChrome.tweaksPanelAria')}
        aria-pressed={tweaksPanelOpen}
        onClick={onTweaksPanelToggle}
        size="sm"
        variant={tweaksPanelOpen ? 'secondary' : 'plain'}
        className={tweaksPanelOpen ? 'preview-chrome-btn-active' : undefined}
      >
        <Icon name="SlidersHorizontal" size={16} strokeWidth={1.5} />
      </IconButton>
    </div>
  );
}

PreviewChrome.displayName = 'PreviewChrome';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the CSS custom properties that size the preview viewport shell
 * for the given device frame. Returns an empty object for 'desktop' (full
 * width / height).
 */
export function previewChromeViewportVars(
  frame: PreviewDeviceFrame,
): Record<string, string> {
  const dims = DEVICE_FRAME_DIMENSIONS[frame];
  if (!dims.w || !dims.h) return {};
  return {
    '--preview-viewport-width': `${dims.w}px`,
    '--preview-viewport-height': `${dims.h}px`,
  };
}
