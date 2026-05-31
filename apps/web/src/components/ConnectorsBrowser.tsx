import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type SyntheticEvent,
} from 'react';
import type { ConnectorConnectResponse, ConnectorDetail, ConnectorStatusResponse } from '@galyarder-design/contracts';
import { useT } from '../i18n';
import type { Dict } from '../i18n/types';
import {
  cancelConnectorAuthorization as cancelConnectorAuthorizationRequest,
  connectConnector,
  disconnectConnector,
  fetchConnectorDetail,
  fetchConnectorDiscovery,
  fetchConnectors,
  fetchConnectorStatuses,
  openExternalUrl,
} from '../providers/registry';
import {
  isTrustedConnectorCallbackOrigin,
  sortConnectorsForSearch,
} from './EntryView';
import { ConnectorLogo, useResolvedTheme } from './ConnectorLogo';
import {
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  EmptyState,
  Icon,
  ScrollArea,
  Spinner,
} from './ds/index';

const CONNECTOR_CALLBACK_MESSAGE_TYPE = 'galyarder-design:connector-connected';
const CONNECTOR_AUTH_PENDING_STORAGE_KEY = 'gd-connectors-authorization-pending';
const CONNECTOR_AUTH_PENDING_POLL_MS = 2_000;
const CONNECTOR_TOOL_PREVIEW_LIMIT = 50;
const AUTHORIZATION_CANCEL_FAILED_MESSAGE = "Couldn't cancel authorization. Try again.";
const CONNECTOR_AUTH_CONTINUE_LABEL = 'Continue in browser';

interface ConnectorAuthorizationPending {
  expiresAt?: string;
  redirectUrl?: string;
}

type ConnectorAuthorizationPendingState = Record<string, ConnectorAuthorizationPending>;

function mergeConnectors(current: ConnectorDetail[], incoming: ConnectorDetail[]): ConnectorDetail[] {
  if (current.length === 0) return incoming;
  const incomingById = new Map(incoming.map((connector) => [connector.id, connector]));
  const merged = current.map((connector) => {
    const next = incomingById.get(connector.id);
    if (!next) return connector;
    return {
      ...connector,
      ...next,
      tools: next.tools.length > 0 ? next.tools : connector.tools,
      toolCount: next.toolCount ?? connector.toolCount,
      toolsNextCursor: next.toolsNextCursor ?? connector.toolsNextCursor,
      toolsHasMore: next.toolsHasMore ?? connector.toolsHasMore,
    };
  });
  const currentIds = new Set(current.map((connector) => connector.id));
  for (const connector of incoming) {
    if (!currentIds.has(connector.id)) merged.push(connector);
  }
  return merged;
}

function loadConnectorAuthorizationPending(): ConnectorAuthorizationPendingState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(CONNECTOR_AUTH_PENDING_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const pending: ConnectorAuthorizationPendingState = {};
    for (const [connectorId, state] of Object.entries(parsed as Record<string, unknown>)) {
      if (!connectorId) continue;
      if (state && typeof state === 'object' && !Array.isArray(state)) {
        const expiresAt = (state as Record<string, unknown>).expiresAt;
        const redirectUrl = (state as Record<string, unknown>).redirectUrl;
        pending[connectorId] = {
          ...(typeof expiresAt === 'string' && expiresAt.trim() ? { expiresAt } : {}),
          ...(typeof redirectUrl === 'string' && redirectUrl.trim() ? { redirectUrl } : {}),
        };
      } else {
        pending[connectorId] = {};
      }
    }
    return pruneConnectorAuthorizationPending(pending);
  } catch {
    return {};
  }
}

function saveConnectorAuthorizationPending(pending: ConnectorAuthorizationPendingState): void {
  if (typeof window === 'undefined') return;
  try {
    if (Object.keys(pending).length === 0) {
      window.sessionStorage.removeItem(CONNECTOR_AUTH_PENDING_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(CONNECTOR_AUTH_PENDING_STORAGE_KEY, JSON.stringify(pending));
    }
  } catch {
    /* Ignore unavailable sessionStorage. */
  }
}

export function pruneConnectorAuthorizationPending(
  pending: ConnectorAuthorizationPendingState,
  nowMs = Date.now(),
): ConnectorAuthorizationPendingState {
  const next: ConnectorAuthorizationPendingState = {};
  for (const [connectorId, state] of Object.entries(pending)) {
    const expiresAtMs = state.expiresAt ? Date.parse(state.expiresAt) : Number.NaN;
    if (Number.isFinite(expiresAtMs) && expiresAtMs <= nowMs) continue;
    next[connectorId] = {
      ...(state.expiresAt ? { expiresAt: state.expiresAt } : {}),
      ...(state.redirectUrl ? { redirectUrl: state.redirectUrl } : {}),
    };
  }
  return next;
}

export function updateConnectorAuthorizationPendingFromConnectResponse(
  pending: ConnectorAuthorizationPendingState,
  response: ConnectorConnectResponse,
  nowMs = Date.now(),
): ConnectorAuthorizationPendingState {
  const connectorId = response.connector.id;
  const next = { ...pending };
  if (response.auth?.kind === 'redirect_required' || response.auth?.kind === 'pending') {
    next[connectorId] = {
      ...(response.auth.expiresAt ? { expiresAt: response.auth.expiresAt } : {}),
      ...(response.auth.redirectUrl ? { redirectUrl: response.auth.redirectUrl } : {}),
    };
    return pruneConnectorAuthorizationPending(next, nowMs);
  }
  delete next[connectorId];
  return pruneConnectorAuthorizationPending(next, nowMs);
}

export function updateConnectorAuthorizationPendingFromStatuses(
  pending: ConnectorAuthorizationPendingState,
  statuses: ConnectorStatusResponse['statuses'],
  nowMs = Date.now(),
): ConnectorAuthorizationPendingState {
  const next = { ...pending };
  for (const [connectorId, status] of Object.entries(statuses)) {
    if (status.status === 'connected') delete next[connectorId];
  }
  return pruneConnectorAuthorizationPending(next, nowMs);
}

export function clearConnectorAuthorizationErrorsForConnected(
  errors: Record<string, string>,
  statuses: ConnectorStatusResponse['statuses'],
): Record<string, string> {
  let mutated = false;
  const next = { ...errors };
  for (const [connectorId, status] of Object.entries(statuses)) {
    if (status.status === 'connected' && next[connectorId] !== undefined) {
      delete next[connectorId];
      mutated = true;
    }
  }
  return mutated ? next : errors;
}

export function clearConnectorAuthorizationCancelFailuresForConnected(
  failures: Record<string, boolean>,
  statuses: ConnectorStatusResponse['statuses'],
): Record<string, boolean> {
  let mutated = false;
  const next = { ...failures };
  for (const [connectorId, status] of Object.entries(statuses)) {
    if (status.status === 'connected' && next[connectorId] !== undefined) {
      delete next[connectorId];
      mutated = true;
    }
  }
  return mutated ? next : failures;
}

export function clearConnectorAuthorizationPending(
  pending: ConnectorAuthorizationPendingState,
  connectorId: string,
): ConnectorAuthorizationPendingState {
  if (pending[connectorId] === undefined) return pending;
  const next = { ...pending };
  delete next[connectorId];
  return next;
}

export function getConnectorDisplayToolCount(connector: ConnectorDetail): number {
  return connector.toolCount ?? connector.tools.length;
}

export function hasLoadedAllAdvertisedConnectorTools(connector: ConnectorDetail): boolean {
  if (connector.toolsNextCursor) return false;
  if (connector.toolCount === undefined) return connector.tools.length > 0;
  return connector.tools.length >= connector.toolCount;
}

function mergeConnectorTools(current: ConnectorDetail['tools'], incoming: ConnectorDetail['tools']): ConnectorDetail['tools'] {
  const seen = new Set<string>();
  const merged: ConnectorDetail['tools'] = [];
  for (const tool of [...current, ...incoming]) {
    if (seen.has(tool.name)) continue;
    seen.add(tool.name);
    merged.push(tool);
  }
  return merged;
}

export function mergeConnectorToolPreview(current: ConnectorDetail, next: ConnectorDetail, append: boolean): ConnectorDetail {
  const merged: ConnectorDetail = {
    ...current,
    ...next,
    tools: append ? mergeConnectorTools(current.tools, next.tools) : next.tools,
    toolCount: next.toolCount ?? current.toolCount,
    toolsHasMore: next.toolsHasMore ?? false,
    featuredToolNames: next.featuredToolNames ?? current.featuredToolNames,
  };
  if (next.toolsNextCursor !== undefined) return { ...merged, toolsNextCursor: next.toolsNextCursor };
  const { toolsNextCursor: _toolsNextCursor, ...withoutCursor } = merged;
  return withoutCursor;
}

export function mergeConnectorActionResult(current: ConnectorDetail, next: ConnectorDetail): ConnectorDetail {
  return {
    ...current,
    ...next,
    tools: next.tools.length > 0 ? next.tools : current.tools,
    toolCount: next.toolCount ?? current.toolCount,
    featuredToolNames: next.featuredToolNames ?? current.featuredToolNames,
  };
}

function applyConnectorStatuses(
  current: ConnectorDetail[],
  statuses: ConnectorStatusResponse['statuses'],
): ConnectorDetail[] {
  if (Object.keys(statuses).length === 0) return current;
  return current.map((connector) => {
    const next = statuses[connector.id];
    if (!next) return connector;
    const { accountLabel: _accountLabel, lastError: _lastError, ...base } = connector;
    return { ...base, ...next };
  });
}

interface ConnectorsBrowserProps {
  composioConfigured: boolean;
  catalogRefreshKey?: string | number;
  /** Optional analytics hook for the integrations surface. The parent
   *  (IntegrationsView -> ConnectorSection) wires this so provider-tab
   *  / search clicks emit on `page_name: 'integrations'`; when omitted
   *  (SettingsDialog uses the settings page family instead), no event
   *  is fired. */
  onConnectorsTabClick?: (
    element: 'provider_chip' | 'search_connectors',
  ) => void;
  /** Analytics hook for the per-connector authorization result. The
   *  daemon emits its own server-side telemetry but the click->outcome
   *  loop happens in the browser; this lets the parent emit
   *  `settings_connector_auth_result` for the completed connect /
   *  disconnect attempts the user kicked off here. */
  onConnectorAuthResult?: (params: {
    connectorId: string;
    action: 'connect' | 'disconnect' | 'refresh';
    result: 'success' | 'failed' | 'cancelled';
    errorCode?: string;
  }) => void;
}

/**
 * Provider tab definition. Today this is just Composio, but the surface is
 * structured as a list-of-tabs because the next provider integration (e.g.
 * a self-hosted MCP registry) is expected to drop in here without rework.
 *
 * `match` decides whether a given catalog entry belongs to this provider:
 * the entry's `auth.provider` is the source of truth, falling back to the
 * lowercased display `provider` for catalog rows that don't carry an auth
 * payload yet.
 */
const PROVIDER_TABS: ReadonlyArray<{
  id: string;
  label: string;
  match: (connector: ConnectorDetail) => boolean;
}> = [
  {
    id: 'composio',
    label: 'Composio',
    match: (connector) => {
      const provider = connector.auth?.provider ?? connector.provider.toLowerCase();
      return provider === 'composio';
    },
  },
];

const DEFAULT_PROVIDER_TAB_ID = 'composio';

const CONNECTOR_CATEGORY_KEYS = {
  'accounting': 'connectors.category.accounting',
  'admin': 'connectors.category.admin',
  'ads & conversion': 'connectors.category.advertising',
  'advertising': 'connectors.category.advertising',
  'ai agents': 'connectors.category.aiAgents',
  'ai chatbots': 'connectors.category.aiAgents',
  'ai infrastructure': 'connectors.category.aiInfrastructure',
  'ai meeting assistants': 'connectors.category.meetings',
  'analytics': 'connectors.category.analytics',
  'artificial intelligence': 'connectors.category.aiAgents',
  'automation': 'connectors.category.automation',
  'bookmark managers': 'connectors.category.personal',
  'calendar': 'connectors.category.calendar',
  'cms': 'connectors.category.cms',
  'code': 'connectors.category.developer',
  'commerce': 'connectors.category.commerce',
  'communication': 'connectors.category.communication',
  'connectors': 'connectors.category.integration',
  'contacts': 'connectors.category.contacts',
  'crm': 'connectors.category.crm',
  'customer support': 'connectors.category.support',
  'data platform': 'connectors.category.dataPlatform',
  'database': 'connectors.category.database',
  'databases': 'connectors.category.database',
  'design': 'connectors.category.design',
  'developer': 'connectors.category.developer',
  'developer tools': 'connectors.category.developer',
  'documents': 'connectors.category.documentation',
  'documentation': 'connectors.category.documentation',
  'ecommerce': 'connectors.category.commerce',
  'education': 'connectors.category.education',
  'email': 'connectors.category.email',
  'email newsletters': 'connectors.category.email',
  'erp': 'connectors.category.erp',
  'electronics': 'connectors.category.commerce',
  'events': 'connectors.category.events',
  'event management': 'connectors.category.events',
  'example': 'connectors.category.integration',
  'feedback': 'connectors.category.surveys',
  'field service': 'connectors.category.fieldService',
  'file management & storage': 'connectors.category.storage',
  'finance': 'connectors.category.finance',
  'fitness': 'connectors.category.fitness',
  'forms': 'connectors.category.forms',
  'forms & surveys': 'connectors.category.forms',
  'fundraising': 'connectors.category.nonprofit',
  'gaming': 'connectors.category.gaming',
  'hospitality': 'connectors.category.hospitality',
  'hr': 'connectors.category.hr',
  'hr talent & recruitment': 'connectors.category.recruiting',
  'human resources': 'connectors.category.hr',
  'images & design': 'connectors.category.design',
  'important': 'connectors.category.integration',
  'integration': 'connectors.category.integration',
  'itsm': 'connectors.category.itsm',
  'it operations': 'connectors.category.itsm',
  'localization': 'connectors.category.localization',
  'logistics': 'connectors.category.logistics',
  'maps': 'connectors.category.maps',
  'marketing': 'connectors.category.marketing',
  'marketing automation': 'connectors.category.marketing',
  'media': 'connectors.category.media',
  'meetings': 'connectors.category.meetings',
  'model context protocol': 'connectors.category.developer',
  'news & lifestyle': 'connectors.category.media',
  'nonprofit': 'connectors.category.nonprofit',
  'notes': 'connectors.category.documentation',
  'notifications': 'connectors.category.communication',
  'observability': 'connectors.category.observability',
  'online courses': 'connectors.category.education',
  'payments': 'connectors.category.payments',
  'payment processing': 'connectors.category.payments',
  'personal': 'connectors.category.personal',
  'phone & sms': 'connectors.category.communication',
  'presentations': 'connectors.category.presentations',
  'premium': 'connectors.category.integration',
  'procurement': 'connectors.category.procurement',
  'product': 'connectors.category.product',
  'product management': 'connectors.category.product',
  'productivity': 'connectors.category.productivity',
  'productivity & project management': 'connectors.category.projectManagement',
  'project management': 'connectors.category.projectManagement',
  'proposal & invoice management': 'connectors.category.accounting',
  'recruiting': 'connectors.category.recruiting',
  'research': 'connectors.category.research',
  'sales': 'connectors.category.salesIntelligence',
  'sales intelligence': 'connectors.category.salesIntelligence',
  'scheduling': 'connectors.category.scheduling',
  'scheduling & booking': 'connectors.category.scheduling',
  'search': 'connectors.category.search',
  'security': 'connectors.category.security',
  'security & identity tools': 'connectors.category.security',
  'server monitoring': 'connectors.category.observability',
  'signing': 'connectors.category.signing',
  'signatures': 'connectors.category.signing',
  'social': 'connectors.category.social',
  'social media accounts': 'connectors.category.social',
  'social media marketing': 'connectors.category.marketing',
  'spreadsheets': 'connectors.category.spreadsheets',
  'storage': 'connectors.category.storage',
  'support': 'connectors.category.support',
  'surveys': 'connectors.category.surveys',
  'task management': 'connectors.category.tasks',
  'tasks': 'connectors.category.tasks',
  'team chat': 'connectors.category.communication',
  'team collaboration': 'connectors.category.communication',
  'time tracking': 'connectors.category.timeTracking',
  'time tracking software': 'connectors.category.timeTracking',
  'url shortener': 'connectors.category.marketing',
  'video': 'connectors.category.video',
  'video & audio': 'connectors.category.video',
  'video conferencing': 'connectors.category.meetings',
  'website builders': 'connectors.category.cms',
  'whiteboard': 'connectors.category.whiteboard',
} as const satisfies Record<string, keyof Dict>;

function statusLabel(status: ConnectorDetail['status'], t: ReturnType<typeof useT>): string {
  switch (status) {
    case 'available':
      return t('connectors.statusAvailable');
    case 'connected':
      return t('connectors.statusConnected');
    case 'error':
      return t('connectors.statusError');
    case 'disabled':
      return t('connectors.statusDisabled');
  }
}

function connectorCategoryLabel(category: string, t: ReturnType<typeof useT>): string {
  const normalized = category.trim().toLowerCase();
  const key = CONNECTOR_CATEGORY_KEYS[normalized as keyof typeof CONNECTOR_CATEGORY_KEYS];
  return key ? t(key) : category;
}

function formatToolsBadge(count: number, t: ReturnType<typeof useT>): string {
  if (count === 0) return t('connectors.toolsBadgeNone');
  if (count === 1) return t('connectors.toolsBadgeOne', { n: count });
  return t('connectors.toolsBadgeMany', { n: count });
}

function getDisplayableConnectorAccountLabel(connector: ConnectorDetail): string | null {
  const label = connector.accountLabel;
  if (!label || typeof label !== 'string') return null;
  const trimmed = label.trim();
  return trimmed || null;
}

/** Derive connector status badge variant for DS Badge primitive. */
function connectorStatusBadgeVariant(
  status: ConnectorDetail['status'],
  authorizationPending: boolean,
): 'success' | 'warning' | 'danger' | 'neutral' {
  if (authorizationPending) return 'warning';
  switch (status) {
    case 'connected': return 'success';
    case 'error': return 'danger';
    case 'disabled': return 'neutral';
    default: return 'neutral';
  }
}

/** Single connector row rendered inside the connectors section. */
function ConnectorRow({
  connector,
  disabled,
  pendingAction,
  authorizationPending,
  authorizationCancelFailed,
  logoTheme,
  onConnect,
  onDisconnect,
  onCancelAuthorization,
  onOpenDetails,
}: {
  connector: ConnectorDetail;
  disabled: boolean;
  pendingAction: 'connect' | 'disconnect' | null;
  authorizationPending?: ConnectorAuthorizationPending;
  authorizationCancelFailed: boolean;
  logoTheme: 'light' | 'dark';
  onConnect: (connectorId: string) => Promise<void> | void;
  onDisconnect: (connectorId: string) => Promise<void> | void;
  onCancelAuthorization: (connectorId: string) => void;
  onOpenDetails: (connectorId: string) => void;
}) {
  const t = useT();
  const isConnected = connector.status === 'connected';
  const isConnecting = pendingAction === 'connect';
  const isDisconnecting = pendingAction === 'disconnect';
  const isAuthorizationPending = !isConnected && authorizationPending !== undefined;
  const isPending = pendingAction !== null || isAuthorizationPending;
  const canConnect = !disabled && !isPending && connector.status === 'available';
  const canDisconnect = !disabled && !isPending && isConnected;
  const badgeVariant = connectorStatusBadgeVariant(connector.status, isAuthorizationPending);
  const badgeLabel = isAuthorizationPending
    ? t('connectors.authorizationPending')
    : statusLabel(connector.status, t);

  function stop(event: SyntheticEvent) {
    event.stopPropagation();
  }

  function continueAuthorization(event: SyntheticEvent) {
    stop(event);
    if (!authorizationPending?.redirectUrl) return;
    void openExternalUrl(authorizationPending.redirectUrl);
  }

  function onKeyActivate(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    if (!disabled) onOpenDetails(connector.id);
  }

  return (
    <Card
      elevation="resting"
      padding="sm"
      className="connectors-rail-row"
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-label={t('connectors.openDetailsAria', { name: connector.name })}
      onClick={() => { if (!disabled) onOpenDetails(connector.id); }}
      onKeyDown={onKeyActivate}
    >
      <span className="connectors-rail-row-logo" aria-hidden>
        <ConnectorLogo connector={connector} theme={logoTheme} size="sm" />
      </span>
      <span className="connectors-rail-row-name">{connector.name}</span>
      <Badge variant={badgeVariant} size="sm" className="connectors-rail-row-badge">
        {badgeLabel}
      </Badge>
      <span className="connectors-rail-row-actions" onClick={stop} onKeyDown={stop}>
        {isConnected ? (
          <Button
            variant="secondary"
            size="sm"
            loading={isDisconnecting}
            disabled={!canDisconnect}
            aria-label={t('connectors.disconnect')}
            onClick={(e) => { stop(e); void onDisconnect(connector.id); }}
          >
            {t('connectors.disconnect')}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            loading={isConnecting || isAuthorizationPending}
            disabled={!canConnect}
            aria-label={isAuthorizationPending ? t('connectors.authorizationPending') : t('connectors.connect')}
            onClick={(e) => { stop(e); void onConnect(connector.id); }}
          >
            {isAuthorizationPending ? t('connectors.authorizationPending') : t('connectors.connect')}
          </Button>
        )}
        {isAuthorizationPending && authorizationPending?.redirectUrl ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={continueAuthorization}
          >
            {CONNECTOR_AUTH_CONTINUE_LABEL}
          </Button>
        ) : null}
        {isAuthorizationPending ? (
          <Button
            variant="ghost"
            size="sm"
            aria-label={t('connectors.cancelAuthorization')}
            onClick={(e) => { stop(e); onCancelAuthorization(connector.id); }}
          >
            {t('connectors.cancelAuthorization')}
          </Button>
        ) : null}
      </span>
      {authorizationCancelFailed ? (
        <Banner variant="danger" className="connectors-rail-row-alert" role="alert">
          {AUTHORIZATION_CANCEL_FAILED_MESSAGE}
        </Banner>
      ) : null}
    </Card>
  );
}

/**
 * Connector cards + search, lifted out of the entry-view top tab so it can
 * live under Settings -> Connectors. Owns its own data lifecycle: fetches the
 * catalog on mount, lazily enriches with Composio discovery when the user
 * actually opens the surface, and rehydrates statuses on window focus and
 * OAuth callback messages.
 *
 * Redesigned as a `<section aria-labelledby>` block per Req 21.1 with Card
 * rows, Avatar logos, Badge status, and primary Button actions (Req 21.2).
 * Per-section error isolation with retry (Req 21.5). EmptyState when zero
 * entries (Req 21.6). ScrollArea wraps the list for independent scrolling.
 */
export function ConnectorsBrowser({
  composioConfigured,
  catalogRefreshKey = 0,
  onConnectorsTabClick,
  onConnectorAuthResult,
}: ConnectorsBrowserProps) {
  const t = useT();
  const [connectors, setConnectors] = useState<ConnectorDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toolsLoading, setToolsLoading] = useState(false);
  const [toolsLoaded, setToolsLoaded] = useState(false);
  const [pendingConnectorAction, setPendingConnectorAction] = useState<{
    connectorId: string;
    action: 'connect' | 'disconnect';
  } | null>(null);
  const [connectorAuthorizationPending, setConnectorAuthorizationPending] = useState<ConnectorAuthorizationPendingState>(() => loadConnectorAuthorizationPending());
  const [connectorAuthorizationCancelFailed, setConnectorAuthorizationCancelFailed] = useState<Record<string, boolean>>({});
  const [connectorAuthorizationError, setConnectorAuthorizationError] = useState<Record<string, string>>({});
  const [detailConnectorId, setDetailConnectorId] = useState<string | null>(null);
  const [toolPreviewLoadingIds, setToolPreviewLoadingIds] = useState<Record<string, boolean>>({});
  const [toolPreviewFetchedIds, setToolPreviewFetchedIds] = useState<Record<string, boolean>>({});
  const [toolPreviewFailedIds, setToolPreviewFailedIds] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>(DEFAULT_PROVIDER_TAB_ID);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchTrackedRef = useRef(false);
  const logoTheme = useResolvedTheme();
  const toolPreviewRetryToken = `${composioConfigured ? 'configured' : 'unconfigured'}:${String(catalogRefreshKey)}`;
  const headingId = 'connectors-rail-heading';

  const reloadConnectorStatuses = useCallback(async () => {
    const statuses = await fetchConnectorStatuses();
    setConnectors((curr) => applyConnectorStatuses(curr, statuses));
    setConnectorAuthorizationPending((curr) => updateConnectorAuthorizationPendingFromStatuses(curr, statuses));
    setConnectorAuthorizationError((curr) => clearConnectorAuthorizationErrorsForConnected(curr, statuses));
    setConnectorAuthorizationCancelFailed((curr) => clearConnectorAuthorizationCancelFailuresForConnected(curr, statuses));
    return statuses;
  }, []);

  const connectorAuthorizationPendingRef = useRef(connectorAuthorizationPending);
  useEffect(() => {
    connectorAuthorizationPendingRef.current = connectorAuthorizationPending;
  }, [connectorAuthorizationPending]);

  const cancelStaleAuthorizations = useCallback(async (
    pendingBeforeReload: ConnectorAuthorizationPendingState,
    statuses: ConnectorStatusResponse['statuses'],
    nowMs = Date.now(),
  ) => {
    const stuck = Object.keys(pendingBeforeReload).filter((connectorId) => {
      if (statuses[connectorId]?.status === 'connected') return false;
      const expiresAt = pendingBeforeReload[connectorId]?.expiresAt;
      if (!expiresAt) return false;
      const expiresAtMs = Date.parse(expiresAt);
      return Number.isFinite(expiresAtMs) && expiresAtMs <= nowMs;
    });
    if (stuck.length === 0) return;
    await Promise.allSettled(stuck.map(async (connectorId) => {
      let connector: ConnectorDetail | null = null;
      try {
        connector = await cancelConnectorAuthorizationRequest(connectorId);
      } catch {
        connector = null;
      }
      if (!connector) {
        setConnectorAuthorizationCancelFailed((curr) => ({ ...curr, [connectorId]: true }));
        return;
      }
      updateConnector(connector);
      setConnectorAuthorizationCancelFailed((curr) => {
        if (curr[connectorId] === undefined) return curr;
        const next = { ...curr };
        delete next[connectorId];
        return next;
      });
      setConnectorAuthorizationError((curr) => {
        if (curr[connectorId] === undefined) return curr;
        const next = { ...curr };
        delete next[connectorId];
        return next;
      });
      setConnectorAuthorizationPending((curr) => clearConnectorAuthorizationPending(curr, connectorId));
    }));
  }, []);

  useEffect(() => {
    saveConnectorAuthorizationPending(connectorAuthorizationPending);
  }, [connectorAuthorizationPending]);

  useEffect(() => {
    if (Object.keys(connectorAuthorizationPending).length === 0) return;
    const interval = window.setInterval(() => {
      setConnectorAuthorizationPending((curr) => pruneConnectorAuthorizationPending(curr));
      void reloadConnectorStatuses();
    }, CONNECTOR_AUTH_PENDING_POLL_MS);
    return () => window.clearInterval(interval);
  }, [connectorAuthorizationPending, reloadConnectorStatuses]);

  // Initial catalog fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setToolsLoaded(false);
    (async () => {
      try {
        const next = await fetchConnectors();
        if (cancelled) return;
        setConnectors((curr) => mergeConnectors(curr, next));
        setLoadError(null);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [composioConfigured, catalogRefreshKey]);

  // Lazy Composio discovery
  useEffect(() => {
    if (!composioConfigured) {
      setToolsLoaded(false);
      setToolsLoading(false);
      return;
    }
    if (toolsLoaded) return;
    let cancelled = false;
    setToolsLoading(true);
    (async () => {
      const next = await fetchConnectorDiscovery({ refresh: true });
      if (cancelled) return;
      setConnectors((curr) => mergeConnectors(curr, next));
      setToolsLoaded(true);
      setToolsLoading(false);
    })();
    return () => {
      cancelled = true;
      setToolsLoading(false);
    };
  }, [composioConfigured, catalogRefreshKey, toolsLoaded]);

  // OAuth callback
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (
        !data ||
        typeof data !== 'object' ||
        (data as { type?: unknown }).type !== CONNECTOR_CALLBACK_MESSAGE_TYPE
      )
        return;
      if (!isTrustedConnectorCallbackOrigin(event.origin)) return;
      void reloadConnectorStatuses();
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [reloadConnectorStatuses]);

  // Window focus refresh
  useEffect(() => {
    async function onFocus() {
      const pendingBeforeReload = connectorAuthorizationPendingRef.current;
      const statuses = await reloadConnectorStatuses();
      await cancelStaleAuthorizations(pendingBeforeReload, statuses);
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [reloadConnectorStatuses, cancelStaleAuthorizations]);

  const needsComposioKey = !composioConfigured;

  const providerScopedConnectors = useMemo(() => {
    const tab =
      PROVIDER_TABS.find((p) => p.id === selectedProvider) ??
      PROVIDER_TABS.find((p) => p.id === DEFAULT_PROVIDER_TAB_ID);
    if (!tab) return connectors;
    return connectors.filter((connector) => tab.match(connector));
  }, [connectors, selectedProvider]);

  const filteredConnectors = useMemo(() => {
    return sortConnectorsForSearch(providerScopedConnectors, filter);
  }, [providerScopedConnectors, filter]);

  const hasQuery = filter.trim().length > 0;
  const hasNoResults = hasQuery && filteredConnectors.length === 0;

  function updateConnector(next: ConnectorDetail | null) {
    if (!next) return;
    setConnectors((curr) => curr.map((connector) => (
      connector.id === next.id ? mergeConnectorActionResult(connector, next) : connector
    )));
  }

  async function runConnectorAction(connectorId: string, action: 'connect' | 'disconnect') {
    if (pendingConnectorAction) return;
    setPendingConnectorAction({ connectorId, action });
    try {
      if (action === 'connect') {
        setConnectorAuthorizationCancelFailed((curr) => {
          if (curr[connectorId] === undefined) return curr;
          const next = { ...curr };
          delete next[connectorId];
          return next;
        });
        setConnectorAuthorizationError((curr) => {
          if (curr[connectorId] === undefined) return curr;
          const next = { ...curr };
          delete next[connectorId];
          return next;
        });
        try {
          const result = await connectConnector(connectorId);
          updateConnector(result.connector);
          if (result.connector && !result.error) {
            setConnectorAuthorizationPending((curr) => updateConnectorAuthorizationPendingFromConnectResponse(curr, {
              connector: result.connector!,
              ...(result.auth === undefined ? {} : { auth: result.auth }),
            }));
            onConnectorAuthResult?.({ connectorId, action: 'connect', result: 'success' });
          } else {
            setConnectorAuthorizationPending((curr) => clearConnectorAuthorizationPending(curr, connectorId));
            if (result.error) {
              setConnectorAuthorizationError((curr) => ({ ...curr, [connectorId]: result.error! }));
            }
            onConnectorAuthResult?.({
              connectorId,
              action: 'connect',
              result: 'failed',
              ...(result.error ? { errorCode: result.error } : {}),
            });
          }
        } catch (err) {
          onConnectorAuthResult?.({
            connectorId,
            action: 'connect',
            result: 'failed',
            errorCode: err instanceof Error ? err.message : String(err),
          });
          throw err;
        }
      } else {
        setConnectorAuthorizationPending((curr) => clearConnectorAuthorizationPending(curr, connectorId));
        setConnectorAuthorizationError((curr) => {
          if (curr[connectorId] === undefined) return curr;
          const next = { ...curr };
          delete next[connectorId];
          return next;
        });
        try {
          updateConnector(await disconnectConnector(connectorId));
          onConnectorAuthResult?.({ connectorId, action: 'disconnect', result: 'success' });
        } catch (err) {
          onConnectorAuthResult?.({
            connectorId,
            action: 'disconnect',
            result: 'failed',
            errorCode: err instanceof Error ? err.message : String(err),
          });
          throw err;
        }
      }
    } finally {
      setPendingConnectorAction(null);
    }
  }

  const detailConnector = useMemo(
    () => (detailConnectorId ? connectors.find((c) => c.id === detailConnectorId) ?? null : null),
    [detailConnectorId, connectors],
  );

  async function hydrateToolPreview(connectorId: string, cursor?: string) {
    if (!composioConfigured) return;
    if (toolPreviewLoadingIds[connectorId]) return;
    setToolPreviewLoadingIds((curr) => ({ ...curr, [connectorId]: true }));
    try {
      const next = await fetchConnectorDetail(connectorId, {
        hydrateTools: true,
        toolsLimit: CONNECTOR_TOOL_PREVIEW_LIMIT,
        ...(cursor === undefined ? {} : { toolsCursor: cursor }),
      });
      if (next) {
        setConnectors((curr) => curr.map((connector) => (
          connector.id === next.id ? mergeConnectorToolPreview(connector, next, cursor !== undefined) : connector
        )));
        setToolPreviewFetchedIds((curr) => ({ ...curr, [connectorId]: true }));
        setToolPreviewFailedIds((curr) => {
          if (curr[connectorId] === undefined) return curr;
          const nextFailed = { ...curr };
          delete nextFailed[connectorId];
          return nextFailed;
        });
      } else {
        setToolPreviewFailedIds((curr) => ({ ...curr, [connectorId]: toolPreviewRetryToken }));
      }
    } catch {
      setToolPreviewFailedIds((curr) => ({ ...curr, [connectorId]: toolPreviewRetryToken }));
    } finally {
      setToolPreviewLoadingIds((curr) => ({ ...curr, [connectorId]: false }));
    }
  }

  useEffect(() => {
    if (!detailConnector) return;
    if (!composioConfigured) return;
    if (hasLoadedAllAdvertisedConnectorTools(detailConnector)) return;
    if (toolPreviewFetchedIds[detailConnector.id]) return;
    if (toolPreviewFailedIds[detailConnector.id] === toolPreviewRetryToken) return;
    if (toolPreviewLoadingIds[detailConnector.id]) return;
    void hydrateToolPreview(detailConnector.id);
  }, [composioConfigured, detailConnector, toolPreviewFailedIds, toolPreviewFetchedIds, toolPreviewLoadingIds, toolPreviewRetryToken]);

  function openConnectorDetails(connectorId: string) {
    setToolPreviewFailedIds((curr) => {
      if (curr[connectorId] === undefined) return curr;
      const next = { ...curr };
      delete next[connectorId];
      return next;
    });
    setDetailConnectorId(connectorId);
  }

  async function cancelConnectorAuthorization(connectorId: string) {
    const connector = await cancelConnectorAuthorizationRequest(connectorId);
    if (connector) {
      updateConnector(connector);
      setConnectorAuthorizationCancelFailed((curr) => {
        if (curr[connectorId] === undefined) return curr;
        const next = { ...curr };
        delete next[connectorId];
        return next;
      });
      setConnectorAuthorizationError((curr) => {
        if (curr[connectorId] === undefined) return curr;
        const next = { ...curr };
        delete next[connectorId];
        return next;
      });
      setConnectorAuthorizationPending((curr) => clearConnectorAuthorizationPending(curr, connectorId));
      return;
    }
    try {
      const statuses = await reloadConnectorStatuses();
      if (statuses[connectorId]?.status === 'connected') return;
    } catch {
      // Keep the local failure visible when the status refresh itself fails.
    }
    setConnectorAuthorizationCancelFailed((curr) => ({ ...curr, [connectorId]: true }));
  }

  // Render the section
  return (
    <section
      className="connectors-rail-section"
      aria-labelledby={headingId}
    >
      <div className="connectors-rail-section-head">
        <h2 id={headingId} className="connectors-rail-section-title">
          {t('connectors.title')}
        </h2>
        {/* Provider tabs */}
        <div
          className="connectors-rail-provider-tabs"
          role="tablist"
          aria-label="Connector provider"
        >
          {PROVIDER_TABS.map((provider) => {
            const active = provider.id === selectedProvider;
            return (
              <button
                key={provider.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`connectors-rail-provider-tab${active ? ' is-active' : ''}`}
                onClick={() => {
                  onConnectorsTabClick?.('provider_chip');
                  setSelectedProvider(provider.id);
                }}
              >
                {provider.label}
              </button>
            );
          })}
        </div>
        {/* Search */}
        <div className="connectors-rail-search">
          <span className="connectors-rail-search-icon" aria-hidden>
            <Icon name="Search" size={16} strokeWidth={1.5} />
          </span>
          <input
            ref={searchInputRef}
            type="search"
            value={filter}
            onFocus={() => {
              if (searchTrackedRef.current) return;
              searchTrackedRef.current = true;
              onConnectorsTabClick?.('search_connectors');
            }}
            onChange={(event) => setFilter(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && filter) {
                event.preventDefault();
                event.stopPropagation();
                setFilter('');
              }
            }}
            placeholder={t('connectors.searchPlaceholder')}
            aria-label={t('connectors.searchAriaLabel')}
            disabled={needsComposioKey}
            className="connectors-rail-search-input"
          />
          {hasQuery ? (
            <button
              type="button"
              className="connectors-rail-search-clear"
              aria-label={t('connectors.searchClear')}
              onClick={() => {
                setFilter('');
                searchInputRef.current?.focus();
              }}
            >
              <Icon name="X" size={16} strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Error state — per-section, retry available (Req 21.5) */}
      {loadError ? (
        <div className="connectors-rail-error">
          <Banner variant="danger" role="alert">
            {loadError}
          </Banner>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setLoadError(null);
              setLoading(true);
              fetchConnectors()
                .then((next) => {
                  setConnectors((curr) => mergeConnectors(curr, next));
                  setLoadError(null);
                })
                .catch((err: unknown) => {
                  setLoadError(err instanceof Error ? err.message : String(err));
                })
                .finally(() => setLoading(false));
            }}
          >
            Retry
          </Button>
        </div>
      ) : loading ? (
        <div className="connectors-rail-loading" aria-live="polite">
          <Spinner size="sm" aria-label={t('common.loading')} />
        </div>
      ) : hasNoResults && !needsComposioKey ? (
        /* No search results — not an EmptyState, just a status message */
        <p className="connectors-rail-no-results" role="status" aria-live="polite">
          {t('connectors.emptyNoMatchTitle', { query: filter.trim() })}
          {' '}
          <button
            type="button"
            className="connectors-rail-clear-search"
            onClick={() => {
              setFilter('');
              searchInputRef.current?.focus();
            }}
          >
            {t('connectors.emptyNoMatchAction')}
          </button>
        </p>
      ) : filteredConnectors.length === 0 && !needsComposioKey ? (
        /* Zero entries — EmptyState per Req 21.6 */
        <EmptyState
          icon={<Icon name="Plug" size={24} strokeWidth={1.5} />}
          title="No connectors"
          description="Connect a service to give the agent access to external tools."
          action={
            <Button variant="primary" size="sm" onClick={() => setFilter('')}>
              Browse connectors
            </Button>
          }
        />
      ) : (
        /* ScrollArea wraps the list for independent scrolling (Req 21.1) */
        <ScrollArea
          className={`connectors-rail-list${needsComposioKey ? ' is-masked' : ''}`}
          aria-hidden={needsComposioKey || undefined}
          ariaLabel={needsComposioKey ? undefined : 'Connectors list'}
        >
          {filteredConnectors.map((connector) => (
            <ConnectorRow
              key={connector.id}
              connector={connector}
              disabled={needsComposioKey}
              pendingAction={
                pendingConnectorAction?.connectorId === connector.id
                  ? pendingConnectorAction.action
                  : null
              }
              authorizationPending={connectorAuthorizationPending[connector.id]}
              authorizationCancelFailed={connectorAuthorizationCancelFailed[connector.id] === true}
              logoTheme={logoTheme}
              onConnect={(connectorId) => runConnectorAction(connectorId, 'connect')}
              onDisconnect={(connectorId) => runConnectorAction(connectorId, 'disconnect')}
              onCancelAuthorization={cancelConnectorAuthorization}
              onOpenDetails={openConnectorDetails}
            />
          ))}
        </ScrollArea>
      )}

      {/* Composio key gate overlay */}
      {needsComposioKey ? (
        <div
          className="connectors-rail-gate"
          role="region"
          aria-label={t('connectors.gateTitle')}
        >
          <Card elevation="resting" padding="md" className="connectors-rail-gate-card">
            <span className="connectors-rail-gate-icon" aria-hidden>
              <Icon name="Settings" size={20} strokeWidth={1.5} />
            </span>
            <h3 className="connectors-rail-gate-title">{t('connectors.gateTitle')}</h3>
            <p className="connectors-rail-gate-body">{t('connectors.gateBody')}</p>
          </Card>
        </div>
      ) : null}

      {/* Detail drawer — preserved from original implementation */}
      {detailConnector ? (
        <ConnectorDetailDrawer
          connector={detailConnector}
          disabled={needsComposioKey}
          pendingAction={
            pendingConnectorAction?.connectorId === detailConnector.id
              ? pendingConnectorAction.action
              : null
          }
          authorizationPending={connectorAuthorizationPending[detailConnector.id]}
          authorizationCancelFailed={connectorAuthorizationCancelFailed[detailConnector.id] === true}
          authorizationError={connectorAuthorizationError[detailConnector.id] ?? null}
          toolsLoading={toolsLoading}
          toolsPreviewLoading={Boolean(toolPreviewLoadingIds[detailConnector.id])}
          toolsLoaded={
            Boolean(toolPreviewFetchedIds[detailConnector.id])
            || toolPreviewFailedIds[detailConnector.id] === toolPreviewRetryToken
            || hasLoadedAllAdvertisedConnectorTools(detailConnector)
          }
          logoTheme={logoTheme}
          onClose={() => setDetailConnectorId(null)}
          onConnect={(connectorId) => runConnectorAction(connectorId, 'connect')}
          onDisconnect={(connectorId) => runConnectorAction(connectorId, 'disconnect')}
          onCancelAuthorization={cancelConnectorAuthorization}
          onLoadMoreTools={(connectorId, cursor) => hydrateToolPreview(connectorId, cursor)}
        />
      ) : null}
    </section>
  );
}

function ConnectorDetailDrawer({
  connector,
  disabled,
  pendingAction,
  authorizationPending,
  authorizationCancelFailed,
  authorizationError,
  toolsLoading,
  toolsPreviewLoading,
  toolsLoaded,
  logoTheme,
  onClose,
  onConnect,
  onDisconnect,
  onCancelAuthorization,
  onLoadMoreTools,
}: {
  connector: ConnectorDetail;
  disabled: boolean;
  pendingAction: 'connect' | 'disconnect' | null;
  authorizationPending?: ConnectorAuthorizationPending;
  authorizationCancelFailed: boolean;
  authorizationError: string | null;
  toolsLoading: boolean;
  toolsPreviewLoading: boolean;
  toolsLoaded: boolean;
  logoTheme: 'light' | 'dark';
  onClose: () => void;
  onConnect: (connectorId: string) => Promise<void> | void;
  onDisconnect: (connectorId: string) => Promise<void> | void;
  onCancelAuthorization: (connectorId: string) => void;
  onLoadMoreTools: (connectorId: string, cursor: string) => Promise<void> | void;
}) {
  const t = useT();
  const isConnected = connector.status === 'connected';
  const isConnecting = pendingAction === 'connect';
  const isDisconnecting = pendingAction === 'disconnect';
  const isAuthorizationPending = !isConnected && authorizationPending !== undefined;
  const isPending = pendingAction !== null || isAuthorizationPending;
  const canConnect = !disabled && !isPending && connector.status === 'available';
  const canDisconnect = !disabled && !isPending && isConnected;
  const accountLabel = getDisplayableConnectorAccountLabel(connector);
  const actualToolCount = connector.tools.length;
  const toolCount = getConnectorDisplayToolCount(connector);
  const isLoadingTools = toolsPreviewLoading || !toolsLoaded || (toolsLoading && actualToolCount === 0);
  const toolDetailsUnavailable = toolsLoaded && actualToolCount === 0 && toolCount > 0;
  const showToolsBadge = connector.toolCount !== undefined || actualToolCount > 0 || toolsLoaded;
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const categoryLabel = connectorCategoryLabel(connector.category, t);
  const badgeVariant = connectorStatusBadgeVariant(connector.status, isAuthorizationPending);
  const badgeLabel = isAuthorizationPending
    ? t('connectors.authorizationPending')
    : statusLabel(connector.status, t);

  function continueAuthorization(event: SyntheticEvent) {
    event.stopPropagation();
    if (!authorizationPending?.redirectUrl) return;
    void openExternalUrl(authorizationPending.redirectUrl);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="connector-drawer-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className="connector-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="connector-drawer-title"
        data-testid="connector-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="connector-drawer-head">
          <Avatar
            size="lg"
            shape="square"
            alt={connector.name}
            initials={connector.name.slice(0, 2).toUpperCase()}
            className="connector-drawer-avatar"
          />
          <div className="connector-drawer-titles">
            <div className="connector-drawer-eyebrow">
              <span>{categoryLabel}</span>
              <span className="connector-meta-dot" aria-hidden>·</span>
              <span>{connector.provider}</span>
            </div>
            <h2 id="connector-drawer-title">{connector.name}</h2>
            <div className="connector-drawer-status">
              <Badge variant={badgeVariant} size="sm">
                {badgeLabel}
              </Badge>
              {showToolsBadge ? (
                <Badge variant="neutral" size="sm" title={formatToolsBadge(toolCount, t)}>
                  <Icon name="Settings2" size={16} strokeWidth={1.5} />
                  {formatToolsBadge(toolCount, t)}
                </Badge>
              ) : null}
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="ghost connector-drawer-close"
            onClick={onClose}
            aria-label={t('common.close')}
            data-testid="connector-drawer-close"
          >
            <Icon name="X" size={16} strokeWidth={1.5} />
          </button>
        </header>

        <div className="connector-drawer-body">
          {/* Primary action */}
          <div className="connector-drawer-action-row">
            {isConnected ? (
              <Button
                variant="secondary"
                size="md"
                loading={isDisconnecting}
                disabled={!canDisconnect}
                onClick={() => onDisconnect(connector.id)}
              >
                {t('connectors.disconnect')}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                loading={isConnecting || isAuthorizationPending}
                disabled={!canConnect}
                onClick={() => onConnect(connector.id)}
              >
                {isAuthorizationPending ? t('connectors.authorizationPending') : t('connectors.connect')}
              </Button>
            )}
            {isAuthorizationPending && authorizationPending?.redirectUrl ? (
              <Button variant="ghost" size="md" onClick={continueAuthorization}>
                {CONNECTOR_AUTH_CONTINUE_LABEL}
              </Button>
            ) : null}
            {isAuthorizationPending ? (
              <Button
                variant="ghost"
                size="md"
                onClick={() => onCancelAuthorization(connector.id)}
              >
                {t('connectors.cancelAuthorization')}
              </Button>
            ) : null}
          </div>

          {authorizationError ? (
            <Banner variant="danger" role="alert" className="connector-drawer-alert">
              {authorizationError}
            </Banner>
          ) : null}
          {authorizationCancelFailed ? (
            <Banner variant="danger" role="alert" className="connector-drawer-alert">
              {AUTHORIZATION_CANCEL_FAILED_MESSAGE}
            </Banner>
          ) : null}

          {connector.description ? (
            <section className="connector-drawer-section">
              <h3 className="connector-drawer-section-title">{t('connectors.aboutLabel')}</h3>
              <p className="connector-drawer-description">{connector.description}</p>
              {isAuthorizationPending ? (
                <div className="connector-authorization-block" role="status">
                  <p className="connector-authorization-hint">
                    {t('connectors.authorizationPendingHint')}
                  </p>
                  {authorizationPending?.redirectUrl ? (
                    <button
                      type="button"
                      className="connector-authorization-link"
                      onClick={continueAuthorization}
                    >
                      {CONNECTOR_AUTH_CONTINUE_LABEL}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}

          <section className="connector-drawer-section">
            <h3 className="connector-drawer-section-title">{t('connectors.detailsLabel')}</h3>
            <dl className="connector-drawer-details">
              <div>
                <dt>{t('connectors.statusLabel')}</dt>
                <dd>{statusLabel(connector.status, t)}</dd>
              </div>
              <div>
                <dt>{t('connectors.categoryLabel')}</dt>
                <dd>{categoryLabel}</dd>
              </div>
              <div>
                <dt>{t('connectors.providerLabel')}</dt>
                <dd>{connector.provider}</dd>
              </div>
              {accountLabel ? (
                <div>
                  <dt>{t('connectors.account')}</dt>
                  <dd>{accountLabel}</dd>
                </div>
              ) : null}
              {connector.lastError ? (
                <div className="connector-drawer-details-error">
                  <dt>{t('connectors.statusError')}</dt>
                  <dd>{connector.lastError}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="connector-drawer-section">
            <h3 className="connector-drawer-section-title">
              {t('connectors.toolsSection')}{' '}
              <span className="connector-drawer-count">{toolCount}</span>
            </h3>
            {isLoadingTools ? (
              <p className="connector-drawer-empty">
                <Spinner size="sm" aria-label={t('connectors.toolsLoading')} />
                {' '}{t('connectors.toolsLoading')}
              </p>
            ) : toolDetailsUnavailable ? (
              <p className="connector-drawer-empty">{t('connectors.toolDetailsUnavailable', { n: toolCount })}</p>
            ) : actualToolCount === 0 ? (
              <p className="connector-drawer-empty">{t('connectors.noToolsAvailable')}</p>
            ) : (
              <>
                <ul className="connector-drawer-tools">
                  {connector.tools.map((tool) => (
                    <li key={tool.name} className="connector-drawer-tool">
                      <div className="connector-drawer-tool-head">
                        <span className="connector-drawer-tool-title">{tool.title || tool.name}</span>
                        <Badge
                          variant="neutral"
                          size="sm"
                          className={`connector-drawer-tool-badge side-${tool.safety.sideEffect}`}
                          title={tool.safety.reason}
                        >
                          {tool.safety.sideEffect}
                        </Badge>
                      </div>
                      {tool.description ? (
                        <p className="connector-drawer-tool-desc">{tool.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {connector.toolsHasMore && connector.toolsNextCursor ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLoadMoreTools(connector.id, connector.toolsNextCursor!)}
                    className="connector-drawer-load-more"
                  >
                    {t('connectors.loadMoreTools')}
                  </Button>
                ) : null}
              </>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
