import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ConnectorLogo, useResolvedTheme } from './ConnectorLogo';
import { useT } from '../i18n';

type Translate = ReturnType<typeof useT>;
import { renderMarkdown } from '../runtime/markdown';
import type {
  ConnectorDetail,
  ConnectorDiscoveryResponse,
  ConnectorMemorySuggestionResponse,
  ConnectorStatusResponse,
  MemoryChangeEvent,
  MemoryEntry,
  MemoryEntrySummary,
  MemoryExtractionEvent,
  MemoryExtractionRecord,
  MemoryExtractionSkipReason,
  MemoryExtractionsResponse,
  MemoryListResponse,
  MemoryTreeListResponse,
  MemoryTreeNode,
  MemorySuggestion,
  MemoryType,
} from '@galyarder-design/contracts';
import {
  connectConnector,
  fetchConnectorStatuses,
} from '../providers/registry';
import {
  Badge,
  Banner,
  Button,
  Card,
  Chip,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  EmptyState,
  Icon,
  IconButton,
  ScrollArea,
  Spinner,
  Switch,
  TextInput,
  Textarea,
  toast,
} from './ds/index';
import type { IconName } from './ds/index';

const TYPES: MemoryType[] = ['user', 'feedback', 'project', 'reference'];

interface DraftEntry {
  id?: string;
  name: string;
  description: string;
  type: MemoryType;
  body: string;
}

const EMPTY_DRAFT: DraftEntry = {
  name: '',
  description: '',
  type: 'user',
  body: '',
};

const STARTERS: ReadonlyArray<{
  type: MemoryType;
  nameKey: 'settings.memoryStarterUserName' | 'settings.memoryStarterFeedbackName' | 'settings.memoryStarterProjectName';
  descKey: 'settings.memoryStarterUserDesc' | 'settings.memoryStarterFeedbackDesc' | 'settings.memoryStarterProjectDesc';
  bodyKey: 'settings.memoryStarterUserBody' | 'settings.memoryStarterFeedbackBody' | 'settings.memoryStarterProjectBody';
}> = [
  {
    type: 'user',
    nameKey: 'settings.memoryStarterUserName',
    descKey: 'settings.memoryStarterUserDesc',
    bodyKey: 'settings.memoryStarterUserBody',
  },
  {
    type: 'feedback',
    nameKey: 'settings.memoryStarterFeedbackName',
    descKey: 'settings.memoryStarterFeedbackDesc',
    bodyKey: 'settings.memoryStarterFeedbackBody',
  },
  {
    type: 'project',
    nameKey: 'settings.memoryStarterProjectName',
    descKey: 'settings.memoryStarterProjectDesc',
    bodyKey: 'settings.memoryStarterProjectBody',
  },
];

const MEMORY_CONNECTOR_APP_IDS = [
  'notion',
  'figma',
  'linear',
  'google_drive',
  'github',
  'slack',
] as const;

const MEMORY_CONNECTOR_APP_LABELS: Record<string, string> = {
  notion: 'Notion',
  figma: 'Figma',
  linear: 'Linear',
  google_drive: 'Google Drive',
  github: 'GitHub',
  slack: 'Slack',
};

type ConnectorMemoryAttempt = ConnectorMemorySuggestionResponse['connectors'][number];
type ConnectorStatusMap = ConnectorStatusResponse['statuses'];

const CONNECTOR_CALLBACK_MESSAGE_TYPE = 'galyarder-design:connector-connected';
const MEMORY_CONNECTOR_PENDING_AUTH_STORAGE_KEY = 'gd:memory:pending-connector-auth';

function isTrustedConnectorCallbackOrigin(origin: string): boolean {
  const expectedOrigin = typeof window === 'undefined' ? '' : window.location.origin;
  if (origin === expectedOrigin) return true;
  try {
    const url = new URL(origin);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    return (
      url.hostname === 'localhost'
      || url.hostname === '127.0.0.1'
      || url.hostname === '[::1]'
      || url.hostname === '::1'
    );
  } catch {
    return false;
  }
}

function readPendingConnectorAuthIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.sessionStorage.getItem(MEMORY_CONNECTOR_PENDING_AUTH_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === 'string' && id.trim().length > 0));
  } catch {
    return new Set();
  }
}

function writePendingConnectorAuthIds(ids: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    if (ids.size === 0) {
      window.sessionStorage.removeItem(MEMORY_CONNECTOR_PENDING_AUTH_STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(
      MEMORY_CONNECTOR_PENDING_AUTH_STORAGE_KEY,
      JSON.stringify([...ids]),
    );
  } catch {
    // Session storage can be blocked; the in-memory state still works.
  }
}

async function fetchMemoryList(): Promise<MemoryListResponse> {
  const resp = await fetch('/api/memory');
  if (!resp.ok) {
    return {
      enabled: true,
      chatExtractionEnabled: true,
      rootDir: '',
      index: '',
      entries: [],
      extraction: null,
    };
  }
  return (await resp.json()) as MemoryListResponse;
}

async function fetchMemoryTree(): Promise<MemoryTreeNode[]> {
  const resp = await fetch('/api/memory/tree');
  if (!resp.ok) return [];
  const json = (await resp.json()) as MemoryTreeListResponse;
  return json.tree ?? [];
}

async function fetchMemoryEntry(id: string): Promise<MemoryEntry | null> {
  const resp = await fetch(`/api/memory/${encodeURIComponent(id)}`);
  if (!resp.ok) return null;
  const json = (await resp.json()) as { entry: MemoryEntry };
  return json.entry ?? null;
}

async function saveMemoryEntry(draft: DraftEntry): Promise<MemoryEntry | null> {
  const url = draft.id
    ? `/api/memory/${encodeURIComponent(draft.id)}`
    : '/api/memory';
  const resp = await fetch(url, {
    method: draft.id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  if (!resp.ok) return null;
  const json = (await resp.json()) as { entry: MemoryEntry };
  return json.entry ?? null;
}

function memoryEntryIdForConnectorSuggestion(suggestion: MemorySuggestion): string | undefined {
  return /^[a-z0-9_]+$/.test(suggestion.id) ? suggestion.id : undefined;
}

async function deleteMemoryEntry(id: string): Promise<boolean> {
  const resp = await fetch(`/api/memory/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return resp.ok;
}

async function saveMemoryIndex(index: string): Promise<boolean> {
  const resp = await fetch('/api/memory/index', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index }),
  });
  return resp.ok;
}

async function setMemoryEnabled(enabled: boolean): Promise<boolean> {
  const resp = await fetch('/api/memory/config', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  });
  return resp.ok;
}

async function setMemoryChatExtractionEnabled(
  chatExtractionEnabled: boolean,
): Promise<boolean> {
  const resp = await fetch('/api/memory/config', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatExtractionEnabled }),
  });
  return resp.ok;
}

async function fetchExtractions(): Promise<MemoryExtractionRecord[]> {
  const resp = await fetch('/api/memory/extractions');
  if (!resp.ok) return [];
  const json = (await resp.json()) as MemoryExtractionsResponse;
  return json.extractions ?? [];
}

async function fetchMemoryConnectors(): Promise<ConnectorDetail[]> {
  const resp = await fetch('/api/connectors/discovery?hydrateTools=false');
  if (!resp.ok) return [];
  const json = (await resp.json()) as ConnectorDiscoveryResponse;
  return json.connectors ?? [];
}

async function suggestConnectorMemories(
  connectorIds: string[],
  context: { chatAgentId?: string | null; chatModel?: string | null } = {},
): Promise<ConnectorMemorySuggestionResponse | null> {
  const body: {
    connectorIds: string[];
    chatAgentId?: string;
    chatModel?: string;
  } = { connectorIds };
  if (context.chatAgentId) body.chatAgentId = context.chatAgentId;
  if (context.chatModel) body.chatModel = context.chatModel;
  const resp = await fetch('/api/memory/connectors/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) return null;
  return (await resp.json()) as ConnectorMemorySuggestionResponse;
}

function describeConnectorReadIssue(
  result: ConnectorMemorySuggestionResponse,
): string | null {
  const failed = result.connectors.filter((connector) => connector.status === 'failed');
  const skipped = result.connectors.filter((connector) => connector.status === 'skipped');
  const firstIssue = failed[0] ?? skipped[0];
  if (!firstIssue) return null;

  const connectorName =
    firstIssue.connectorName
    || MEMORY_CONNECTOR_APP_LABELS[firstIssue.connectorId]
    || firstIssue.connectorId;
  const reason = (firstIssue.error || firstIssue.summary || '').trim();
  const suffix = reason ? ` ${reason}` : '';

  if (failed.length > 0) {
    return `Couldn't read ${connectorName}.${suffix}`;
  }
  return `No readable content from ${connectorName}.${suffix}`;
}

interface FriendlyExtractionFailure {
  title: string;
  detail: string;
  action?: string;
}

function providerDisplayName(provider: MemoryExtractionRecord['provider'] | undefined): string {
  if (provider?.credentialSource === 'chat-cli') {
    if (provider.kind === 'anthropic') return 'Claude Code';
    return 'Local CLI';
  }
  switch (provider?.kind) {
    case 'anthropic':
      return 'Anthropic';
    case 'azure':
      return 'Azure OpenAI';
    case 'google':
      return 'Google Gemini';
    case 'ollama':
      return 'Ollama';
    case 'openai':
      return 'OpenAI';
    default:
      return 'Memory model';
  }
}

function parseProviderError(raw: string): { message: string; code: string; status: number | null } {
  const jsonStart = raw.indexOf('{');
  let message = raw.trim();
  let code = '';
  let status: number | null = null;

  if (jsonStart >= 0) {
    try {
      const parsed = JSON.parse(raw.slice(jsonStart));
      const error = parsed?.error;
      if (typeof error?.message === 'string') message = error.message;
      else if (typeof parsed?.message === 'string') message = parsed.message;
      if (typeof error?.code === 'string') code = error.code;
      else if (typeof parsed?.code === 'string') code = parsed.code;
      if (typeof parsed?.status === 'number') status = parsed.status;
      else if (typeof error?.status === 'number') status = error.status;
    } catch {
      // Fall through to regex parsing below.
    }
  }

  const statusMatch = /\b(4\d\d|5\d\d)\b/.exec(raw);
  if (status === null && statusMatch?.[1]) status = Number(statusMatch[1]);

  return {
    message: message.replace(/\s+/g, ' ').trim(),
    code,
    status,
  };
}

function describeExtractionFailure(record: MemoryExtractionRecord): FriendlyExtractionFailure | null {
  if (record.phase !== 'failed' || !record.error) return null;
  const providerName = providerDisplayName(record.provider);
  const usesChatCli = record.provider?.credentialSource === 'chat-cli';
  const parsed = parseProviderError(record.error);
  const haystack = `${parsed.message} ${parsed.code} ${record.error}`.toLowerCase();
  const source =
    record.kind === 'connector'
      ? 'Connected apps were read, but GalyarderDesign could not turn that context into memory.'
      : 'GalyarderDesign could not run memory extraction for this chat.';

  if (
    parsed.status === 401
    || /token[_ -]?expired|authentication token has expired|invalid[_ -]?api[_ -]?key|unauthorized/.test(haystack)
  ) {
    return {
      title: `${providerName} authentication expired`,
      detail: source,
      action: usesChatCli
        ? 'Sign in to the selected Local CLI or choose a different Memory model.'
        : 'Update the Memory extraction model key or sign in again.',
    };
  }

  if (parsed.status === 429 || /rate limit|quota|too many requests|insufficient_quota/.test(haystack)) {
    return {
      title: `${providerName} quota or rate limit hit`,
      detail: source,
      action: 'Try again later or switch the Memory extraction model.',
    };
  }

  if (/network|fetch failed|timeout|timed out|econnreset|enotfound/.test(haystack)) {
    return {
      title: `${providerName} request failed`,
      detail: source,
      action: usesChatCli
        ? 'Check the selected Local CLI and try again.'
        : 'Check the model provider connection and try again.',
    };
  }

  return {
    title: 'Memory extraction failed',
    detail: parsed.message || source,
    action: usesChatCli
      ? 'Try again after checking the selected Local CLI.'
      : 'Try again after checking the Memory extraction model settings.',
  };
}

function formatConnectorContextBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return 'No data';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function connectorAttemptName(attempt: ConnectorMemoryAttempt): string {
  return attempt.connectorName
    || MEMORY_CONNECTOR_APP_LABELS[attempt.connectorId]
    || attempt.connectorId;
}

function connectorAttemptTitle(attempt: ConnectorMemoryAttempt): string {
  const connectorName = connectorAttemptName(attempt);
  if (attempt.status === 'succeeded') return `Read ${connectorName}`;
  if (attempt.status === 'failed') return `Could not read ${connectorName}`;
  return `Skipped ${connectorName}`;
}

function connectorAttemptDetail(attempt: ConnectorMemoryAttempt): string {
  const parts = [
    attempt.toolTitle || attempt.toolName,
    attempt.status === 'failed' ? attempt.error : null,
    attempt.summary,
  ]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
  return parts.join(' · ');
}

function mergeMemoryConnector(current: ConnectorDetail, next: ConnectorDetail): ConnectorDetail {
  return {
    ...current,
    ...next,
    tools: next.tools.length > 0 ? next.tools : current.tools,
    toolCount: next.toolCount ?? current.toolCount,
    toolsNextCursor: next.toolsNextCursor ?? current.toolsNextCursor,
    toolsHasMore: next.toolsHasMore ?? current.toolsHasMore,
  };
}

function upsertMemoryConnector(
  current: ConnectorDetail[],
  next: ConnectorDetail | null,
): ConnectorDetail[] {
  if (!next) return current;
  let found = false;
  const merged = current.map((connector) => {
    if (connector.id !== next.id) return connector;
    found = true;
    return mergeMemoryConnector(connector, next);
  });
  return found ? merged : [...merged, next];
}

function applyMemoryConnectorStatus(
  connector: ConnectorDetail,
  status: ConnectorStatusMap[string],
): ConnectorDetail {
  const { accountLabel: _accountLabel, lastError: _lastError, ...base } = connector;
  return { ...base, ...status };
}

function applyMemoryConnectorStatuses(
  current: ConnectorDetail[],
  statuses: ConnectorStatusMap,
): ConnectorDetail[] {
  if (Object.keys(statuses).length === 0) return current;
  return current.map((connector) => {
    const status = statuses[connector.id];
    if (!status) return connector;
    return applyMemoryConnectorStatus(connector, status);
  });
}

function connectorWithPendingAuthorization(connector: ConnectorDetail): ConnectorDetail {
  const { accountLabel: _accountLabel, lastError: _lastError, ...base } = connector;
  return {
    ...base,
    status: base.status === 'disabled' ? 'disabled' : 'available',
  };
}

async function deleteExtraction(id: string): Promise<boolean> {
  const resp = await fetch(
    `/api/memory/extractions/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  );
  return resp.ok;
}

async function clearExtractionHistory(): Promise<boolean> {
  const resp = await fetch('/api/memory/extractions', { method: 'DELETE' });
  return resp.ok;
}

function describeRecord(
  record: MemoryExtractionRecord,
  t: Translate,
): {
  phaseLabel: string;
  reasonLabel: string | null;
  kindLabel: string;
  tone: 'running' | 'success' | 'skipped' | 'failed';
} {
  const tone: 'running' | 'success' | 'skipped' | 'failed' =
    record.phase === 'running'
    || record.phase === 'success'
    || record.phase === 'failed'
      ? record.phase
      : 'skipped';
  const phaseLabel = (() => {
    switch (record.phase) {
      case 'running':
        return t('settings.memoryExtractionPhaseRunning');
      case 'success':
        return t('settings.memoryExtractionPhaseSuccess');
      case 'skipped':
        return t('settings.memoryExtractionPhaseSkipped');
      case 'failed':
        return t('settings.memoryExtractionPhaseFailed');
      default:
        return record.phase;
    }
  })();
  const reasonLabel = (() => {
    if (record.phase !== 'skipped') return null;
    const reason: MemoryExtractionSkipReason | undefined = record.reason;
    if (reason === 'no-provider') return t('settings.memoryExtractionSkipNoProvider');
    if (reason === 'memory-disabled') return t('settings.memoryExtractionSkipDisabled');
    if (reason === 'chat-disabled') return 'Chat conversation learning is off.';
    if (reason === 'empty-message') return t('settings.memoryExtractionSkipEmpty');
    if (reason === 'no-match') return t('settings.memoryExtractionSkipNoMatch');
    return null;
  })();
  const kind = record.kind ?? 'llm';
  const kindLabel =
    kind === 'heuristic'
      ? t('settings.memoryExtractionKindHeuristic')
      : kind === 'connector'
        ? 'Connected apps'
      : t('settings.memoryExtractionKindLlm');
  return { phaseLabel, reasonLabel, kindLabel, tone };
}

function formatRelativeTime(at: number, now: number): string {
  const delta = Math.max(0, now - at);
  if (delta < 60_000) return `${Math.round(delta / 1000)}s`;
  if (delta < 3_600_000) return `${Math.round(delta / 60_000)}m`;
  if (delta < 86_400_000) return `${Math.round(delta / 3_600_000)}h`;
  return `${Math.round(delta / 86_400_000)}d`;
}

function formatAbsoluteTime(at: number, now: number): string {
  const date = new Date(at);
  const today = new Date(now);
  const sameDay =
    date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate();
  const time = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  if (sameDay) return time;
  const day = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  return `${day} ${time}`;
}

function formatDuration(record: MemoryExtractionRecord): string | null {
  if (!record.finishedAt) return null;
  const ms = Math.max(0, record.finishedAt - record.startedAt);
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 1000)}s`;
}

function formatRelativeTimeAgo(at: number, now: number): string {
  const relative = formatRelativeTime(at, now);
  return relative === '0s' ? 'just now' : `${relative} ago`;
}

function memoryCountLabel(count: number): string {
  return count === 1 ? 'memory' : 'memories';
}

function extractionCardTitle(record: MemoryExtractionRecord, t: Translate): string {
  const kind = record.kind ?? 'llm';
  if (kind !== 'connector') {
    return record.userMessagePreview || t('settings.memoryExtractions');
  }

  if (record.phase === 'running') return 'Scanning connected apps';
  if (record.phase === 'failed') return 'Connected app scan failed';
  if (record.phase === 'skipped') return 'Connected app scan skipped';

  if (record.phase === 'success') {
    const writtenCount =
      typeof record.writtenCount === 'number' ? record.writtenCount : null;
    if (writtenCount && writtenCount > 0) {
      return `Saved ${writtenCount} ${memoryCountLabel(writtenCount)}`;
    }
    return 'No new memories found';
  }

  return 'Connected app scan';
}

function extractionCardMeta(
  record: MemoryExtractionRecord,
  now: number,
  t: Translate,
): string {
  const kind = record.kind ?? 'llm';
  const age = formatRelativeTimeAgo(record.startedAt, now);
  if (kind === 'connector') {
    if (record.phase === 'running') return 'Checking selected apps';
    if (record.phase === 'failed') return `Needs attention · ${age}`;
    if (record.phase === 'skipped') return `Skipped · ${age}`;
    if (record.phase === 'success') {
      const writtenCount =
        typeof record.writtenCount === 'number' ? record.writtenCount : null;
      const result =
        writtenCount && writtenCount > 0
          ? 'From connected apps'
          : 'Checked selected apps';
      return `${result} · ${age}`;
    }
    return `Connected apps · ${age}`;
  }

  const duration = formatDuration(record);
  const parts = [
    formatAbsoluteTime(record.startedAt, now),
    formatRelativeTime(record.startedAt, now),
  ];
  if (duration) parts.push(`${t('settings.memoryExtractionDuration')} ${duration}`);
  if (record.phase === 'success' && typeof record.writtenCount === 'number') {
    parts.push(`${record.writtenCount} ${t('settings.memoryExtractionWritten')}`);
  }
  return parts.join(' · ');
}

type FlashKind = 'created' | 'saved' | 'deleted' | 'indexSaved' | 'pathCopied';
type MemoryTab = 'manual' | 'chat' | 'connected';

export interface MemorySectionProps {
  onOpenConnectors?: () => void;
  chatAgentId?: string | null;
  chatModel?: string | null;
}

export function MemorySection({
  onOpenConnectors,
  chatAgentId = null,
  chatModel = null,
}: MemorySectionProps = {}) {
  const t = useT();
  const logoTheme = useResolvedTheme();
  const [enabled, setEnabled] = useState(true);
  const [chatExtractionEnabled, setChatExtractionEnabled] = useState(true);
  const [rootDir, setRootDir] = useState('');
  const [index, setIndex] = useState('');
  const [indexDraft, setIndexDraft] = useState<string | null>(null);
  const [entries, setEntries] = useState<MemoryEntrySummary[]>([]);
  const [memoryTree, setMemoryTree] = useState<MemoryTreeNode[]>([]);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewBody, setPreviewBody] = useState<string | null>(null);
  const [editing, setEditing] = useState<DraftEntry | null>(null);
  const [busy, setBusy] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | MemoryType>('all');
  const [activeTab, setActiveTab] = useState<MemoryTab>('manual');

  // Search state — max 200 chars, debounced 300ms (Req 20.1, 20.3)
  const [searchRaw, setSearchRaw] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prune dialog state (Req 20.4)
  const [pruneDialogOpen, setPruneDialogOpen] = useState(false);
  const [pruning, setPruning] = useState(false);
  const [pruneError, setPruneError] = useState<string | null>(null);
  const [pruneRetryList, setPruneRetryList] = useState<MemoryEntrySummary[]>([]);

  const [flash, setFlash] = useState<{ kind: FlashKind; key: number } | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorNameRef = useRef<HTMLInputElement | null>(null);
  const editingTarget = editing?.id ?? (editing ? 'new' : null);

  const [extractions, setExtractions] = useState<MemoryExtractionRecord[]>([]);
  const [connectors, setConnectors] = useState<ConnectorDetail[]>([]);
  const [connectorStatuses, setConnectorStatuses] = useState<ConnectorStatusMap>({});
  const [connectorsLoading, setConnectorsLoading] = useState(true);
  const [selectedConnectorIds, setSelectedConnectorIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [connectorExtracting, setConnectorExtracting] = useState(false);
  const [connectorSaving, setConnectorSaving] = useState(false);
  const [connectorSuggestions, setConnectorSuggestions] = useState<MemorySuggestion[]>([]);
  const [selectedSuggestionIds, setSelectedSuggestionIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [connectorAttempts, setConnectorAttempts] = useState<ConnectorMemoryAttempt[]>([]);
  const [connectorContextBytes, setConnectorContextBytes] = useState(0);
  const [connectorStatus, setConnectorStatus] = useState<string | null>(null);
  const [connectorError, setConnectorError] = useState<string | null>(null);
  const [connectingConnectorIds, setConnectingConnectorIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [pendingConnectorAuthIds, setPendingConnectorAuthIds] = useState<Set<string>>(
    readPendingConnectorAuthIds,
  );
  const [connectorConnectErrors, setConnectorConnectErrors] = useState<Record<string, string>>({});

  const fireFlash = useCallback((kind: FlashKind) => {
    setFlash({ kind, key: Date.now() });
  }, []);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 1800);
    return () => clearTimeout(id);
  }, [flash]);

  useEffect(() => {
    if (!editingTarget) return;
    editorRef.current?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
    editorNameRef.current?.focus({ preventScroll: true });
  }, [editingTarget]);

  const flashLabel = useMemo<Record<FlashKind, string>>(
    () => ({
      created: t('settings.memoryFlashCreated'),
      saved: t('settings.memoryFlashSaved'),
      deleted: t('settings.memoryFlashDeleted'),
      indexSaved: t('settings.memoryFlashIndexSaved'),
      pathCopied: t('settings.memoryFlashPathCopied'),
    }),
    [t],
  );

  const onCopyPath = useCallback(async () => {
    if (!rootDir) return;
    try {
      await navigator.clipboard.writeText(rootDir);
      fireFlash('pathCopied');
    } catch {
      const input = document.createElement('input');
      input.value = rootDir;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      fireFlash('pathCopied');
    }
  }, [rootDir, fireFlash]);

  const TYPE_LABEL: Record<MemoryType, string> = useMemo(
    () => ({
      user: t('settings.memoryTypeUser'),
      feedback: t('settings.memoryTypeFeedback'),
      project: t('settings.memoryTypeProject'),
      reference: t('settings.memoryTypeReference'),
    }),
    [t],
  );

  const reload = useCallback(async () => {
    const [list, tree] = await Promise.all([
      fetchMemoryList(),
      fetchMemoryTree(),
    ]);
    setEnabled(list.enabled);
    setChatExtractionEnabled(list.chatExtractionEnabled !== false);
    setRootDir(list.rootDir);
    setIndex(list.index);
    setEntries(list.entries);
    setMemoryTree(tree);
  }, []);

  const reloadExtractions = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const next = await fetchExtractions();
      setExtractions(next);
      return next;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const reloadConnectors = useCallback(async () => {
    setConnectorsLoading(true);
    try {
      const statusesPromise = fetchConnectorStatuses();
      const connectorsPromise = fetchMemoryConnectors();
      const statuses = await statusesPromise;
      setConnectorStatuses(statuses);
      setConnectors((prev) => applyMemoryConnectorStatuses(prev, statuses));
      setConnectors(applyMemoryConnectorStatuses(await connectorsPromise, statuses));
    } finally {
      setConnectorsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
    void reloadExtractions();
  }, [reload, reloadExtractions]);

  useEffect(() => {
    if (activeTab !== 'connected') return;
    void reloadConnectors();
  }, [activeTab, reloadConnectors]);

  useEffect(() => {
    writePendingConnectorAuthIds(pendingConnectorAuthIds);
  }, [pendingConnectorAuthIds]);

  useEffect(() => {
    const es = new EventSource('/api/memory/events');
    es.addEventListener('change', (raw) => {
      try {
        const ev = JSON.parse((raw as MessageEvent).data) as MemoryChangeEvent;
        if (!ev || !ev.kind) return;
        void reload();
      } catch {
        // Malformed — ignore.
      }
    });
    es.addEventListener('extraction', (raw) => {
      try {
        const ev = JSON.parse((raw as MessageEvent).data) as MemoryExtractionEvent;
        if (!ev || !ev.id) return;
        if (ev.phase === 'cleared') {
          setExtractions([]);
          return;
        }
        if (ev.phase === 'deleted') {
          setExtractions((prev) => prev.filter((r) => r.id !== ev.id));
          return;
        }
        setExtractions((prev) => {
          const existing = prev.findIndex((r) => r.id === ev.id);
          if (existing >= 0) {
            const next = prev.slice();
            next[existing] = ev;
            return next;
          }
          return [ev, ...prev].slice(0, 30);
        });
      } catch {
        // Malformed — ignore.
      }
    });
    return () => {
      es.close();
    };
  }, [reload]);

  // 300ms debounce for search (Req 20.3)
  const onSearchChange = useCallback((value: string) => {
    const clamped = value.slice(0, 200);
    setSearchRaw(clamped);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setSearchQuery(clamped);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  const filtered = useMemo(() => {
    let base = filter === 'all' ? entries : entries.filter((e) => e.type === filter);
    // Case-insensitive substring search (Req 20.3)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(
        (e) =>
          e.name.toLowerCase().includes(q)
          || (e.description ?? '').toLowerCase().includes(q),
      );
    }
    return base;
  }, [entries, filter, searchQuery]);

  const showNoProviderBanner = useMemo(() => {
    const latest = extractions[0];
    return Boolean(
      latest && latest.phase === 'skipped' && latest.reason === 'no-provider',
    );
  }, [extractions]);

  const [nowClock, setNowClock] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowClock(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const connectorExtractions = useMemo(
    () => extractions.filter((record) => record.kind === 'connector'),
    [extractions],
  );
  const visibleExtractions = useMemo(
    () =>
      filter === 'all'
        ? extractions.filter((record) => record.kind !== 'connector')
        : [],
    [extractions, filter],
  );
  const unifiedMemoryCount = filtered.length + visibleExtractions.length;
  const memoryConnectors = useMemo(() => {
    const byId = new Map(connectors.map((connector) => [connector.id, connector]));
    return MEMORY_CONNECTOR_APP_IDS.map((id) => {
      const connector = byId.get(id);
      const status = connectorStatuses[id];
      if (connector) {
        return status ? applyMemoryConnectorStatus(connector, status) : connector;
      }
      return {
        id,
        name: MEMORY_CONNECTOR_APP_LABELS[id] ?? id,
        provider: 'composio',
        category: 'Memory source',
        status: status?.status ?? 'available' as const,
        ...(status?.accountLabel ? { accountLabel: status.accountLabel } : {}),
        ...(status?.lastError ? { lastError: status.lastError } : {}),
        tools: [],
      };
    });
  }, [connectorStatuses, connectors]);
  const connectorIdsWithDetails = useMemo(
    () => new Set(connectors.map((connector) => connector.id)),
    [connectors],
  );
  const connectedMemoryConnectors = useMemo(
    () => memoryConnectors.filter((connector) => connector.status === 'connected'),
    [memoryConnectors],
  );
  const selectedConnectedConnectorIds = useMemo(
    () =>
      [...selectedConnectorIds].filter((id) =>
        connectedMemoryConnectors.some((connector) => connector.id === id),
      ),
    [selectedConnectorIds, connectedMemoryConnectors],
  );
  const connectedCount = connectedMemoryConnectors.length;
  const connectorScanLabel = connectorExtracting
    ? 'Scanning apps'
    : selectedConnectedConnectorIds.length === 0
      ? 'Select apps to scan'
      : 'Scan selected apps';
  const selectedConnectorSuggestions = useMemo(
    () => connectorSuggestions.filter((suggestion) => selectedSuggestionIds.has(suggestion.id)),
    [connectorSuggestions, selectedSuggestionIds],
  );

  useEffect(() => {
    setSelectedConnectorIds((prev) => {
      const connectedIds = connectedMemoryConnectors.map((connector) => connector.id);
      const connected = new Set(connectedIds);
      const next = new Set([...prev].filter((id) => connected.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [connectedMemoryConnectors]);

  const treeFolders = useMemo(
    () => memoryTree.filter((node) => node.kind === 'folder'),
    [memoryTree],
  );

  const treeChildren = useMemo(() => {
    const map = new Map<string, MemoryTreeNode[]>();
    for (const node of memoryTree) {
      if (node.kind !== 'entry' || !node.parentId) continue;
      const list = map.get(node.parentId) ?? [];
      list.push(node);
      map.set(node.parentId, list);
    }
    return map;
  }, [memoryTree]);

  const openPreview = useCallback(
    async (id: string) => {
      if (previewId === id) {
        setPreviewId(null);
        setPreviewBody(null);
        return;
      }
      setPreviewId(id);
      setPreviewBody(null);
      const entry = await fetchMemoryEntry(id);
      setPreviewBody(entry?.body ?? '');
    },
    [previewId],
  );

  const startEdit = useCallback(async (id: string) => {
    const entry = await fetchMemoryEntry(id);
    if (!entry) return;
    setEditing({
      id: entry.id,
      name: entry.name,
      description: entry.description,
      type: entry.type,
      body: entry.body,
    });
  }, []);

  const startNew = useCallback(() => {
    setEditing({ ...EMPTY_DRAFT });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditing(null);
  }, []);

  const toggleConnectorSelection = useCallback((connectorId: string) => {
    setSelectedConnectorIds((prev) => {
      const next = new Set(prev);
      if (next.has(connectorId)) {
        next.delete(connectorId);
      } else {
        next.add(connectorId);
      }
      return next;
    });
  }, []);

  const refreshMemoryConnectorStatuses = useCallback(async () => {
    const statuses = await fetchConnectorStatuses();
    setConnectorStatuses(statuses);
    setConnectors((prev) => applyMemoryConnectorStatuses(prev, statuses));
    setPendingConnectorAuthIds((prev) => {
      const next = new Set(prev);
      for (const connectorId of prev) {
        if (statuses[connectorId]?.status === 'connected') next.delete(connectorId);
      }
      return next.size === prev.size ? prev : next;
    });
    setConnectorConnectErrors((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const [connectorId, status] of Object.entries(statuses)) {
        if (status.status === 'connected' && next[connectorId] !== undefined) {
          delete next[connectorId];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  useEffect(() => {
    if (pendingConnectorAuthIds.size === 0) return;
    const interval = window.setInterval(() => {
      void refreshMemoryConnectorStatuses();
    }, 2_000);
    const onFocus = () => {
      void refreshMemoryConnectorStatuses();
    };
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [pendingConnectorAuthIds, refreshMemoryConnectorStatuses]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if ((data as { type?: unknown }).type !== CONNECTOR_CALLBACK_MESSAGE_TYPE) return;
      if (!isTrustedConnectorCallbackOrigin(event.origin)) return;
      void refreshMemoryConnectorStatuses();
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [refreshMemoryConnectorStatuses]);

  const onConnectMemoryConnector = useCallback(async (connectorId: string) => {
    if (connectingConnectorIds.has(connectorId)) return;
    setConnectingConnectorIds((prev) => new Set(prev).add(connectorId));
    setConnectorConnectErrors((prev) => {
      if (prev[connectorId] === undefined) return prev;
      const next = { ...prev };
      delete next[connectorId];
      return next;
    });
    try {
      const result = await connectConnector(connectorId);
      const requiresAuthorizationCompletion =
        result.auth?.kind === 'redirect_required' || result.auth?.kind === 'pending';
      setConnectors((prev) =>
        upsertMemoryConnector(
          prev,
          requiresAuthorizationCompletion && result.connector
            ? connectorWithPendingAuthorization(result.connector)
            : result.connector,
        ),
      );
      if (result.error) {
        setConnectorConnectErrors((prev) => ({ ...prev, [connectorId]: result.error! }));
        setPendingConnectorAuthIds((prev) => {
          if (!prev.has(connectorId)) return prev;
          const next = new Set(prev);
          next.delete(connectorId);
          return next;
        });
        return;
      }
      if (result.auth?.kind === 'redirect_required' || result.auth?.kind === 'pending') {
        setPendingConnectorAuthIds((prev) => new Set(prev).add(connectorId));
      } else {
        setPendingConnectorAuthIds((prev) => {
          if (!prev.has(connectorId)) return prev;
          const next = new Set(prev);
          next.delete(connectorId);
          return next;
        });
      }
      await refreshMemoryConnectorStatuses();
    } finally {
      setConnectingConnectorIds((prev) => {
        if (!prev.has(connectorId)) return prev;
        const next = new Set(prev);
        next.delete(connectorId);
        return next;
      });
    }
  }, [connectingConnectorIds, refreshMemoryConnectorStatuses]);

  const toggleConnectorSuggestion = useCallback((suggestionId: string) => {
    setSelectedSuggestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(suggestionId)) {
        next.delete(suggestionId);
      } else {
        next.add(suggestionId);
      }
      return next;
    });
  }, []);

  const onSuggestConnectorMemory = useCallback(async () => {
    if (selectedConnectedConnectorIds.length === 0) return;
    setConnectorExtracting(true);
    setConnectorSuggestions([]);
    setSelectedSuggestionIds(new Set());
    setConnectorAttempts([]);
    setConnectorContextBytes(0);
    setConnectorStatus(null);
    setConnectorError(null);
    const startedAt = Date.now();
    try {
      const result = await suggestConnectorMemories(selectedConnectedConnectorIds, {
        chatAgentId,
        chatModel,
      });
      if (!result) {
        setConnectorError('Could not read connected apps. Try again from the Connectors tab.');
        return;
      }
      const latestExtractions = await reloadExtractions();
      const latestFailure = latestExtractions.find(
        (record) =>
          record.kind === 'connector'
          && record.phase === 'failed'
          && record.startedAt >= startedAt - 5_000,
      );
      const friendlyFailure = latestFailure
        ? describeExtractionFailure(latestFailure)
        : null;
      setConnectorAttempts(result.connectors);
      setConnectorContextBytes(result.contextBytes);
      const succeeded = result.connectors.filter(
        (connector) => connector.status === 'succeeded',
      ).length;
      if (friendlyFailure) {
        setConnectorError([
          friendlyFailure.title,
          friendlyFailure.detail,
          friendlyFailure.action,
        ].filter(Boolean).join(' '));
      } else if (result.suggestions.length > 0) {
        setConnectorSuggestions(result.suggestions);
        setSelectedSuggestionIds(new Set(result.suggestions.map((suggestion) => suggestion.id)));
        setConnectorStatus(
          `Found ${result.suggestions.length} suggested memor${result.suggestions.length === 1 ? 'y' : 'ies'} from ${succeeded} app${succeeded === 1 ? '' : 's'}. Review before saving.`,
        );
      } else if (!result.attemptedLLM) {
        setConnectorError(
          describeConnectorReadIssue(result)
          ?? 'No memory suggestions found. GalyarderDesign could not read useful content from the selected app yet.',
        );
      } else {
        setConnectorStatus(
          `Checked ${succeeded} selected app${succeeded === 1 ? '' : 's'}, but found no new memory suggestions.`,
        );
      }
    } catch (err) {
      setConnectorError(err instanceof Error ? err.message : String(err));
    } finally {
      setConnectorExtracting(false);
    }
  }, [chatAgentId, chatModel, reloadExtractions, selectedConnectedConnectorIds]);

  const onDiscardConnectorSuggestions = useCallback(() => {
    setConnectorSuggestions([]);
    setSelectedSuggestionIds(new Set());
    setConnectorAttempts([]);
    setConnectorContextBytes(0);
    setConnectorStatus(null);
  }, []);

  const onSaveConnectorSuggestions = useCallback(async () => {
    if (selectedConnectorSuggestions.length === 0) return;
    setConnectorSaving(true);
    setConnectorError(null);
    try {
      const saved: MemoryEntry[] = [];
      const savedSuggestionIds = new Set<string>();
      for (const suggestion of selectedConnectorSuggestions) {
        const entry = await saveMemoryEntry({
          id: memoryEntryIdForConnectorSuggestion(suggestion),
          name: suggestion.name,
          description: suggestion.description,
          type: suggestion.type,
          body: suggestion.body,
        });
        if (entry) {
          saved.push(entry);
          savedSuggestionIds.add(suggestion.id);
        }
      }
      await reload();
      const savedEntriesById = new Map(saved.map((entry) => [entry.id, entry]));
      setConnectorSuggestions((prev) =>
        prev.filter((suggestion) => !savedSuggestionIds.has(suggestion.id)),
      );
      setSelectedSuggestionIds(
        new Set(
          selectedConnectorSuggestions
            .filter((suggestion) => !savedSuggestionIds.has(suggestion.id))
            .map((suggestion) => suggestion.id),
        ),
      );
      setConnectorStatus(
        `Saved ${savedEntriesById.size} memor${savedEntriesById.size === 1 ? 'y' : 'ies'} from connected apps.`,
      );
      if (savedEntriesById.size !== selectedConnectorSuggestions.length) {
        setConnectorError(
          `Saved ${savedEntriesById.size} of ${selectedConnectorSuggestions.length} selected memories. Please try the remaining items again.`,
        );
      }
    } catch (err) {
      setConnectorError(err instanceof Error ? err.message : String(err));
    } finally {
      setConnectorSaving(false);
    }
  }, [reload, selectedConnectorSuggestions]);

  const onSave = useCallback(async () => {
    if (!editing) return;
    if (!editing.name.trim()) return;
    const wasNew = !editing.id;
    setBusy(true);
    try {
      const entry = await saveMemoryEntry(editing);
      if (entry) {
        await reload();
        setEditing(null);
        fireFlash(wasNew ? 'created' : 'saved');
      }
    } finally {
      setBusy(false);
    }
  }, [editing, reload, fireFlash]);

  const onDelete = useCallback(
    async (id: string) => {
      const ok = await deleteMemoryEntry(id);
      if (ok) {
        await reload();
        fireFlash('deleted');
      }
    },
    [reload, fireFlash],
  );

  const onToggleEnabled = useCallback(async (next: boolean) => {
    setEnabled(next);
    await setMemoryEnabled(next);
  }, []);

  const onToggleChatExtraction = useCallback(async (next: boolean) => {
    setChatExtractionEnabled(next);
    const ok = await setMemoryChatExtractionEnabled(next);
    if (!ok) setChatExtractionEnabled((current) => !current);
  }, []);

  const onSaveIndex = useCallback(async () => {
    if (indexDraft === null) return;
    setBusy(true);
    try {
      const ok = await saveMemoryIndex(indexDraft);
      if (ok) {
        setIndex(indexDraft);
        setIndexDraft(null);
        fireFlash('indexSaved');
      }
    } finally {
      setBusy(false);
    }
  }, [indexDraft, fireFlash]);

  const onDeleteExtraction = useCallback(async (id: string) => {
    setExtractions((prev) => prev.filter((r) => r.id !== id));
    const ok = await deleteExtraction(id);
    if (!ok) {
      void reloadExtractions();
    }
  }, [reloadExtractions]);

  const onClearExtractions = useCallback(async () => {
    if (!window.confirm(t('settings.memoryExtractionsClearConfirm'))) return;
    setExtractions([]);
    const ok = await clearExtractionHistory();
    if (!ok) {
      void reloadExtractions();
    }
  }, [reloadExtractions, t]);

  // Prune: delete all entries in the current filtered view (Req 20.4, 20.5)
  const pruneTargets = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter((e) => e.type === filter);
  }, [entries, filter]);

  const onPruneConfirm = useCallback(async () => {
    setPruning(true);
    setPruneError(null);
    const targets = pruneTargets;
    const failed: MemoryEntrySummary[] = [];
    try {
      for (const entry of targets) {
        const ok = await deleteMemoryEntry(entry.id);
        if (!ok) failed.push(entry);
      }
      await reload();
      if (failed.length === 0) {
        setPruneDialogOpen(false);
        setPruneRetryList([]);
        // Surface success Toast within 2s (Req 20.5 success path)
        toast.success(
          `Pruned ${targets.length} saved fact${targets.length === 1 ? '' : 's'}`,
          { duration: 2000 },
        );
      } else {
        // Failure: preserve list state, show error, offer retry (Req 20.5)
        setPruneRetryList(failed);
        setPruneError(
          `${failed.length} of ${targets.length} facts could not be deleted. Retry to try again.`,
        );
      }
    } catch (err) {
      setPruneError(err instanceof Error ? err.message : String(err));
      setPruneRetryList(targets);
    } finally {
      setPruning(false);
    }
  }, [pruneTargets, reload]);

  const onPruneRetry = useCallback(async () => {
    if (pruneRetryList.length === 0) return;
    setPruning(true);
    setPruneError(null);
    const targets = pruneRetryList;
    const failed: MemoryEntrySummary[] = [];
    try {
      for (const entry of targets) {
        const ok = await deleteMemoryEntry(entry.id);
        if (!ok) failed.push(entry);
      }
      await reload();
      if (failed.length === 0) {
        setPruneDialogOpen(false);
        setPruneRetryList([]);
        toast.success(
          `Pruned ${targets.length} saved fact${targets.length === 1 ? '' : 's'}`,
          { duration: 2000 },
        );
      } else {
        setPruneRetryList(failed);
        setPruneError(
          `${failed.length} of ${targets.length} facts could not be deleted. Retry to try again.`,
        );
      }
    } catch (err) {
      setPruneError(err instanceof Error ? err.message : String(err));
    } finally {
      setPruning(false);
    }
  }, [pruneRetryList, reload]);

  const isEmpty = entries.length === 0;

  const memoryTabs: ReadonlyArray<{
    id: MemoryTab;
    label: string;
    caption: string;
    icon: IconName;
  }> = [
    {
      id: 'manual',
      label: 'Add manually',
      caption: 'Write a fact or preference',
      icon: 'Pencil',
    },
    {
      id: 'chat',
      label: 'Learn from chats',
      caption: 'Capture useful context',
      icon: 'History',
    },
    {
      id: 'connected',
      label: 'Import from apps',
      caption: 'Scan connected tools',
      icon: 'Link',
    },
  ];

  const renderMemoryEntry = (entry: MemoryEntrySummary) => (
    <Card key={entry.id} elevation="resting" padding="sm" className="memory-fact-card">
      <div className="memory-fact-card-body">
        <div className="memory-fact-card-info">
          <div className="memory-fact-card-title-row">
            <span className="memory-fact-card-name">{entry.name}</span>
            <Badge variant="neutral" size="sm">{entry.id}</Badge>
          </div>
          <div className="memory-fact-card-desc">
            {entry.description || '—'}
          </div>
        </div>
        <div className="memory-fact-card-actions">
          <IconButton
            aria-label={t('settings.memoryPreview')}
            size="sm"
            variant="ghost"
            onClick={() => void openPreview(entry.id)}
          >
            <Icon
              name={previewId === entry.id ? 'ChevronDown' : 'ChevronRight'}
              size={16}
            />
          </IconButton>
          <IconButton
            aria-label={t('settings.memoryEdit')}
            size="sm"
            variant="ghost"
            onClick={() => void startEdit(entry.id)}
          >
            <Icon name="Pencil" size={16} />
          </IconButton>
          <IconButton
            aria-label={t('settings.memoryDelete')}
            size="sm"
            variant="ghost"
            onClick={() => void onDelete(entry.id)}
          >
            <Icon name="X" size={16} />
          </IconButton>
        </div>
      </div>
      {previewId === entry.id && (
        <div className="memory-fact-preview">
          {previewBody === null ? (
            <Spinner size="sm" aria-label={t('common.loading')} />
          ) : previewBody ? (
            <div className="memory-fact-preview-body">
              {renderMarkdown(previewBody)}
            </div>
          ) : (
            <p className="memory-fact-preview-empty">—</p>
          )}
        </div>
      )}
    </Card>
  );

  const renderExtractionCard = (record: MemoryExtractionRecord) => {
    const desc = describeRecord(record, t);
    const title = extractionCardTitle(record, t);
    const meta = extractionCardMeta(record, nowClock, t);
    return (
      <Card
        key={record.id}
        elevation="resting"
        padding="sm"
        className={`memory-extraction-card is-${desc.tone}`}
      >
        <div className="memory-extraction-card-body">
          <div className="memory-extraction-card-info">
            <div className="memory-extraction-title-row">
              <span className="memory-extraction-name">{title}</span>
              <Badge
                variant={
                  desc.tone === 'success' ? 'success'
                  : desc.tone === 'failed' ? 'danger'
                  : desc.tone === 'running' ? 'info'
                  : 'neutral'
                }
                size="sm"
              >
                {desc.phaseLabel}
              </Badge>
              <Badge variant="neutral" size="sm">{desc.kindLabel}</Badge>
            </div>
            <div className="memory-extraction-meta">{meta}</div>
            {desc.reasonLabel ? (
              <div className="memory-extraction-reason">{desc.reasonLabel}</div>
            ) : null}
            {record.phase === 'failed' && record.error ? (
              <div className="memory-extraction-failure">
                {(() => {
                  const failure = describeExtractionFailure(record);
                  if (!failure) return null;
                  return (
                    <>
                      <strong>{failure.title}</strong>
                      <span>{failure.detail}</span>
                      {failure.action ? <span>{failure.action}</span> : null}
                    </>
                  );
                })()}
              </div>
            ) : null}
            {Array.isArray(record.writtenIds) && record.writtenIds.length > 0 ? (
              <div className="memory-extraction-written-ids">
                <span>{t('settings.memoryExtractionWritten')}</span>
                <span className="memory-extraction-id-list">
                  {record.writtenIds.map((id: string) => (
                    <button
                      key={id}
                      type="button"
                      className="memory-extraction-id-chip"
                      onClick={() => void openPreview(id)}
                      title={id}
                    >
                      {id}
                    </button>
                  ))}
                </span>
              </div>
            ) : null}
          </div>
          <IconButton
            aria-label={t('settings.memoryExtractionDelete')}
            size="sm"
            variant="ghost"
            onClick={() => void onDeleteExtraction(record.id)}
          >
            <Icon name="X" size={16} />
          </IconButton>
        </div>
      </Card>
    );
  };

  return (
    <>
      {/* ── Prune confirmation Dialog (Req 20.4) ─────────────────────── */}
      <Dialog
        open={pruneDialogOpen}
        onOpenChange={(open) => {
          if (!pruning) {
            setPruneDialogOpen(open);
            if (!open) {
              setPruneError(null);
              setPruneRetryList([]);
            }
          }
        }}
      >
        <DialogContent size="sm" dismissable={!pruning}>
          <DialogTitle>Prune saved facts</DialogTitle>
          <DialogDescription>
            {pruneRetryList.length > 0
              ? `${pruneRetryList.length} fact${pruneRetryList.length === 1 ? '' : 's'} could not be deleted.`
              : `This will permanently delete ${pruneTargets.length} saved fact${pruneTargets.length === 1 ? '' : 's'}${filter !== 'all' ? ` of type "${filter}"` : ''}. This action cannot be undone.`
            }
          </DialogDescription>
          {pruneError ? (
            <Banner
              variant="danger"
              description={pruneError}
              className="memory-prune-error"
            />
          ) : null}
          <div className="memory-prune-dialog-actions">
            <DialogClose asChild>
              <Button variant="secondary" disabled={pruning}>
                Cancel
              </Button>
            </DialogClose>
            {pruneRetryList.length > 0 ? (
              <Button
                variant="danger"
                loading={pruning}
                onClick={() => void onPruneRetry()}
              >
                Retry
              </Button>
            ) : (
              <Button
                variant="danger"
                loading={pruning}
                onClick={() => void onPruneConfirm()}
              >
                Prune {pruneTargets.length} fact{pruneTargets.length === 1 ? '' : 's'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Memory source section ─────────────────────────────────────── */}
      <section
        className={`settings-section settings-section-card memory-create-section${enabled ? '' : ' is-disabled'}`}
        aria-label={t('settings.memory')}
      >
        {/* Section header */}
        <div className="section-head">
          <div>
            <h3 className="memory-title-row">
              <span>{t('settings.memory')}</span>
              {rootDir ? (
                <span className="memory-info-wrap">
                  <IconButton
                    aria-label="Memory storage path — click to copy"
                    size="sm"
                    variant="ghost"
                    title={rootDir}
                    onClick={() => void onCopyPath()}
                  >
                    <Icon name="Info" size={16} />
                  </IconButton>
                  {flash?.kind === 'pathCopied' ? (
                    <span key={flash.key} className="memory-path-copied-badge" role="status">
                      {flashLabel.pathCopied}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </h3>
            <p className="memory-description">{t('settings.memoryDescription')}</p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => void onToggleEnabled(checked)}
            aria-label={t('settings.memoryEnableLabel')}
          />
        </div>

        {!enabled ? (
          <Banner
            variant="info"
            title={t('settings.memoryDisabled')}
            description={t('settings.memoryDisabledBanner')}
          />
        ) : null}

        {enabled && showNoProviderBanner ? (
          <Banner
            variant="warning"
            title={t('settings.memoryNoProviderBannerTitle')}
            description={t('settings.memoryNoProviderBannerBody')}
          />
        ) : null}

        {/* Source tabs */}
        <div
          className="memory-source-tabs"
          role="tablist"
          aria-label="Memory areas"
        >
          {memoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-label={tab.label}
              aria-selected={activeTab === tab.id}
              className={`memory-source-tab${activeTab === tab.id ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="memory-source-tab-icon" aria-hidden>
                <Icon name={tab.icon} size={16} />
              </span>
              <span className="memory-source-tab-copy">
                <span>{tab.label}</span>
                <small aria-hidden="true">{tab.caption}</small>
              </span>
            </button>
          ))}
        </div>

        {/* Manual tab */}
        {activeTab === 'manual' ? (
          <div className="memory-tab-panel memory-manual-panel" role="tabpanel">
            <div className="memory-source-summary">
              <span className="memory-block-icon" aria-hidden>
                <Icon name="Pencil" size={16} />
              </span>
              <div>
                <h4>Add manually</h4>
                <p className="memory-source-hint">
                  Add facts, preferences, or project context yourself. Fixed assistant
                  behavior lives in Instructions / Rules.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                leadingIcon={<Icon name="Plus" size={16} />}
                onClick={startNew}
                disabled={editing !== null}
              >
                {t('settings.memoryNew')}
              </Button>
            </div>

            {flash && flash.kind !== 'pathCopied' ? (
              <div
                key={flash.key}
                role="status"
                aria-live="polite"
                className="memory-flash-pill"
              >
                {flashLabel[flash.kind]}
              </div>
            ) : null}

            {editing ? (
              <Card
                ref={editorRef}
                elevation="resting"
                padding="md"
                className="memory-editor-card"
              >
                {!editing.id ? (
                  <div className="memory-starters-row">
                    <span className="memory-starters-label">
                      {t('settings.memoryStartersLabel')}
                    </span>
                    {STARTERS.map((starter) => (
                      <button
                        key={starter.nameKey}
                        type="button"
                        className="memory-starter-chip"
                        onClick={() =>
                          setEditing({
                            id: editing.id,
                            type: starter.type,
                            name: t(starter.nameKey),
                            description: t(starter.descKey),
                            body: t(starter.bodyKey),
                          })
                        }
                        title={t(starter.descKey)}
                      >
                        {t(starter.nameKey)}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="memory-editor-fields">
                  <div className="memory-editor-name-row">
                    <div className="memory-editor-name-field">
                      <label className="memory-field-label">
                        {t('settings.memoryNameLabel')}
                      </label>
                      <TextInput
                        ref={editorNameRef}
                        placeholder={t('settings.memoryName')}
                        value={editing.name}
                        onChange={(e) =>
                          setEditing({ ...editing, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="memory-editor-type-field">
                      <label className="memory-field-label">
                        {t('settings.memoryTypeLabel')}
                      </label>
                      <select
                        className="memory-type-select"
                        value={editing.type}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            type: e.target.value as MemoryType,
                          })
                        }
                      >
                        {TYPES.map((tt) => (
                          <option key={tt} value={tt}>
                            {TYPE_LABEL[tt]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="memory-field-label">
                      {t('settings.memoryDescLabel')}
                    </label>
                    <TextInput
                      placeholder={t('settings.memoryDesc')}
                      value={editing.description}
                      onChange={(e) =>
                        setEditing({ ...editing, description: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="memory-field-label">
                      {t('settings.memoryBodyLabel')}
                    </label>
                    <Textarea
                      placeholder={t('settings.memoryBody')}
                      value={editing.body}
                      onChange={(e) =>
                        setEditing({ ...editing, body: e.target.value })
                      }
                      rows={7}
                      className="memory-body-textarea"
                    />
                    <p className="memory-body-hint">{t('settings.memoryBodyHint')}</p>
                  </div>
                </div>
                <div className="memory-editor-footer">
                  <span className="memory-save-hint">{t('settings.memorySaveHint')}</span>
                  <div className="memory-editor-footer-actions">
                    <Button variant="secondary" size="sm" onClick={cancelEdit}>
                      {t('common.cancel')}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      loading={busy}
                      disabled={busy || !editing.name.trim()}
                      onClick={() => void onSave()}
                    >
                      {editing.id ? t('common.save') : t('common.create')}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        ) : null}

        {/* Chat tab */}
        {activeTab === 'chat' ? (
          <div className="memory-tab-panel" role="tabpanel">
            <div className="memory-source-summary">
              <span className="memory-block-icon" aria-hidden>
                <Icon name="History" size={16} />
              </span>
              <div>
                <h4>Learn from chats</h4>
                <p className="memory-source-hint">
                  GalyarderDesign can learn preferences and project facts from future
                  chat turns.
                </p>
              </div>
              <div className="memory-chat-toggle-row">
                <span className="memory-chat-toggle-label">
                  {chatExtractionEnabled ? 'On' : 'Off'}
                </span>
                <Switch
                  checked={chatExtractionEnabled}
                  onCheckedChange={(checked) => void onToggleChatExtraction(checked)}
                  disabled={!enabled}
                  aria-label="Learn from chat conversations"
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* Connected tab */}
        {activeTab === 'connected' ? (
          <div className="memory-tab-panel memory-connected-panel" role="tabpanel">
            <div className="memory-source-summary memory-connected-summary">
              <span className="memory-block-icon" aria-hidden>
                <Icon name="Link" size={16} />
              </span>
              <div>
                <h4>Import from apps</h4>
                <p className="memory-source-hint">
                  Choose apps to scan for design preferences, project context,
                  and visual references. Nothing is scanned until you select an app.
                </p>
              </div>
              <Badge variant="neutral" size="sm">
                {connectorsLoading ? 'Loading' : `${connectedCount} connected`}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenConnectors}
                disabled={!onOpenConnectors}
              >
                Manage
              </Button>
            </div>
            <div className="memory-connector-workbench">
              <div className="memory-connector-picker-head">
                <div>
                  <h4>Choose sources</h4>
                  <p className="memory-source-hint">
                    Select connected apps first. GalyarderDesign only scans the apps you choose.
                  </p>
                </div>
                <Badge variant="neutral" size="sm">
                  {selectedConnectedConnectorIds.length} selected
                </Badge>
              </div>
              <div className="memory-connector-list" aria-label="Connected memory apps">
                {memoryConnectors.map((connector) => {
                  const connected = connector.status === 'connected';
                  const selected = selectedConnectorIds.has(connector.id) && connected;
                  const connecting = connectingConnectorIds.has(connector.id);
                  const authorizationPending = pendingConnectorAuthIds.has(connector.id);
                  const connectError = connectorConnectErrors[connector.id];
                  const statusResolved =
                    connectorIdsWithDetails.has(connector.id)
                    || connectorStatuses[connector.id] !== undefined;
                  const checkingStatus =
                    connectorsLoading
                    && !statusResolved
                    && !connected
                    && !authorizationPending
                    && !connectError
                    && !connecting;
                  const connectorHint = connected
                    ? connector.accountLabel || `${connector.tools.length} read tools`
                    : checkingStatus
                      ? 'Checking connection status…'
                      : authorizationPending
                      ? 'Finish authorization in your browser, then return here'
                      : connectError || 'Connect this app before extraction';
                  return (
                    <label
                      key={connector.id}
                      className={`memory-connector-row${connected ? '' : ' is-disabled'}${selected ? ' is-selected' : ''}`}
                      data-memory-connector-id={connector.id}
                    >
                      <input
                        className="memory-connector-input"
                        type="checkbox"
                        checked={selected}
                        disabled={!connected}
                        aria-label={`Use ${connector.name} for memory extraction`}
                        onChange={() => toggleConnectorSelection(connector.id)}
                      />
                      <span className={`memory-connector-brand${selected ? ' is-selected' : ''}`}>
                        <ConnectorLogo connector={connector} theme={logoTheme} size="sm" />
                        <span className="memory-connector-selected-mark" aria-hidden="true">
                          {selected ? <Icon name="Check" size={16} /> : null}
                        </span>
                      </span>
                      <span className="memory-connector-copy">
                        <strong>{connector.name}</strong>
                        <small>{connectorHint}</small>
                      </span>
                      {connected ? (
                        <span className={`memory-connector-picker${selected ? ' is-selected' : ''}`}>
                          <span className="memory-connector-picker-box" aria-hidden="true">
                            {selected ? <Icon name="Check" size={16} /> : null}
                          </span>
                          <span>{selected ? 'Selected' : 'Select'}</span>
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={connecting || authorizationPending || checkingStatus}
                          aria-busy={connecting || authorizationPending || checkingStatus || undefined}
                          aria-label={`Connect ${connector.name}`}
                          leadingIcon={
                            connecting || authorizationPending || checkingStatus
                              ? <Spinner size="sm" aria-label="Connecting" />
                              : <Icon name="Plus" size={16} />
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            void onConnectMemoryConnector(connector.id);
                          }}
                        >
                          {checkingStatus ? 'Checking' : authorizationPending ? 'Waiting' : connecting ? 'Connecting' : 'Connect'}
                        </Button>
                      )}
                    </label>
                  );
                })}
              </div>
              <div className="memory-connector-actions memory-connector-runbar">
                <span className="memory-connector-runbar-hint">
                  Selected {selectedConnectedConnectorIds.length} of {connectedCount} connected app{connectedCount === 1 ? '' : 's'}.
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  leadingIcon={
                    connectorExtracting
                      ? <Spinner size="sm" aria-label="Scanning" />
                      : <Icon name="Sparkles" size={16} />
                  }
                  onClick={() => void onSuggestConnectorMemory()}
                  disabled={
                    !enabled
                    || connectorExtracting
                    || connectorSaving
                    || selectedConnectedConnectorIds.length === 0
                  }
                >
                  {connectorScanLabel}
                </Button>
              </div>
            </div>

            {connectorSuggestions.length > 0 ? (
              <div className="memory-suggestion-panel">
                <div className="memory-subsection-head">
                  <div>
                    <h4>Suggested memories</h4>
                    <p className="memory-source-hint">
                      Review design-related memories before saving them.
                    </p>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {selectedConnectorSuggestions.length} selected
                  </Badge>
                </div>
                <div className="memory-suggestion-list">
                  {connectorSuggestions.map((suggestion) => {
                    const selected = selectedSuggestionIds.has(suggestion.id);
                    const sourceLabel =
                      suggestion.source?.connectorName
                      || suggestion.source?.toolTitle
                      || 'Connected apps';
                    return (
                      <label
                        key={suggestion.id}
                        className={`memory-suggestion-card${selected ? ' is-selected' : ''}`}
                      >
                        <span className="memory-connector-check">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleConnectorSuggestion(suggestion.id)}
                          />
                          <span aria-hidden="true">
                            {selected ? <Icon name="Check" size={16} /> : null}
                          </span>
                        </span>
                        <span className="memory-suggestion-copy">
                          <span className="memory-suggestion-title">
                            <strong>{suggestion.name}</strong>
                            <Badge variant="neutral" size="sm">
                              {TYPE_LABEL[suggestion.type]}
                            </Badge>
                          </span>
                          {suggestion.description ? (
                            <small>{suggestion.description}</small>
                          ) : null}
                          <span className="memory-suggestion-body">{suggestion.body}</span>
                        </span>
                        <span className="memory-connector-state is-connected">
                          {sourceLabel}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="memory-connector-actions">
                  <Button
                    variant="primary"
                    size="sm"
                    loading={connectorSaving}
                    leadingIcon={
                      connectorSaving
                        ? undefined
                        : <Icon name="Check" size={16} />
                    }
                    onClick={() => void onSaveConnectorSuggestions()}
                    disabled={connectorSaving || selectedConnectorSuggestions.length === 0}
                  >
                    {connectorSaving ? 'Saving' : 'Save selected'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDiscardConnectorSuggestions}
                    disabled={connectorSaving}
                  >
                    Discard
                  </Button>
                </div>
              </div>
            ) : null}
            {connectorStatus ? (
              <Banner variant="info" description={connectorStatus} />
            ) : null}
            {connectorError ? (
              <Banner variant="danger" description={connectorError} />
            ) : null}
            {connectorAttempts.length > 0 ? (
              <div className="memory-connector-diagnostics" aria-label="Connected app read status">
                <div className="memory-connector-diagnostics-head">
                  <strong>Last scan</strong>
                  <span>{formatConnectorContextBytes(connectorContextBytes)} read</span>
                </div>
                <div className="memory-connector-diagnostics-list">
                  {connectorAttempts.map((attempt) => (
                    <div
                      key={`${attempt.connectorId}-${attempt.status}-${attempt.toolName ?? 'none'}`}
                      className={`memory-connector-diagnostic-row is-${attempt.status}`}
                    >
                      <span className="memory-connector-diagnostic-dot" aria-hidden="true" />
                      <span className="memory-connector-diagnostic-copy">
                        <strong>{connectorAttemptTitle(attempt)}</strong>
                        <small>{connectorAttemptDetail(attempt)}</small>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {connectorExtractions.length > 0 ? (
              <details className="memory-scan-history">
                <summary>
                  <span>Recent scans</span>
                  <Badge variant="neutral" size="sm">{connectorExtractions.length}</Badge>
                </summary>
                <div
                  className="memory-connector-run-history"
                  aria-label="Connected app memory run status"
                >
                  {connectorExtractions.slice(0, 4).map(renderExtractionCard)}
                </div>
              </details>
            ) : null}
          </div>
        ) : null}
      </section>

      {/* ── Saved memory section ─────────────────────────────────────── */}
      <section
        className="settings-section settings-section-card memory-records-section"
        aria-label="Saved memory"
      >
        <div className="memory-management-panel">
          {/* Header: search + prune (Req 20.1) */}
          <div className="memory-records-header">
            <div className="memory-records-header-left">
              <h4>Saved memory</h4>
              <p className="memory-description">
                Saved facts, preferences, and project context available to future chats.
              </p>
            </div>
            <div className="memory-records-header-actions">
              {/* Search field — max 200 chars, 300ms debounce (Req 20.1, 20.3) */}
              <TextInput
                placeholder="Search facts…"
                value={searchRaw}
                maxLength={200}
                disabled={isEmpty}
                aria-label="Search saved facts"
                onChange={(e) => onSearchChange(e.target.value)}
                leadingIcon={<Icon name="Search" size={16} />}
                className="memory-search-input"
              />
              {/* Prune button — disabled when empty (Req 20.2) */}
              <Button
                variant="danger"
                size="sm"
                disabled={isEmpty || pruneTargets.length === 0}
                onClick={() => setPruneDialogOpen(true)}
                aria-label={`Prune ${pruneTargets.length} saved fact${pruneTargets.length === 1 ? '' : 's'}`}
              >
                Prune
              </Button>
            </div>
          </div>

          {/* Type filter chips */}
          <div className="memory-filter-toolbar">
            <div className="memory-filter-pills">
              <Chip
                selected={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                {t('settings.memoryAll')}
                <Badge variant="neutral" size="sm" className="memory-filter-count">
                  {entries.length + visibleExtractions.length}
                </Badge>
              </Chip>
              {TYPES.map((type) => {
                const count = entries.filter((e) => e.type === type).length;
                if (count === 0 && filter !== type) return null;
                return (
                  <Chip
                    key={type}
                    selected={filter === type}
                    onClick={() => setFilter(type)}
                  >
                    {TYPE_LABEL[type]}
                    <Badge variant="neutral" size="sm" className="memory-filter-count">{count}</Badge>
                  </Chip>
                );
              })}
            </div>
            <div className="memory-management-actions">
              {visibleExtractions.length > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  leadingIcon={<Icon name="X" size={16} />}
                  onClick={() => void onClearExtractions()}
                  title={t('settings.memoryExtractionsClearTitle')}
                >
                  {t('settings.memoryExtractionsClear')}
                </Button>
              ) : null}
              {visibleExtractions.length > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  leadingIcon={
                    isRefreshing
                      ? <Spinner size="sm" aria-label="Refreshing" />
                      : <Icon name="RefreshCw" size={16} />
                  }
                  onClick={() => void reloadExtractions()}
                  disabled={isRefreshing}
                  title={t('settings.memoryExtractionsRefresh')}
                >
                  {isRefreshing
                    ? t('settings.memoryExtractionsRefreshing')
                    : t('settings.memoryExtractionsRefresh')}
                </Button>
              ) : null}
            </div>
          </div>

          {/* Memory tree */}
          {treeFolders.length > 0 ? (
            <details className="memory-tree-group" open>
              <summary className="memory-details-summary">
                <span className="memory-details-title">Memory tree</span>
                <Badge variant="neutral" size="sm">{memoryTree.length}</Badge>
              </summary>
              <div className="memory-tree-list">
                {treeFolders.map((folder) => {
                  const children = treeChildren.get(folder.id) ?? [];
                  return (
                    <Card key={folder.id} elevation="resting" padding="sm" className="memory-tree-folder">
                      <div className="memory-tree-folder-header">
                        <span className="memory-tree-folder-name">{folder.name}</span>
                        <Badge variant="neutral" size="sm">{folder.path}</Badge>
                      </div>
                      <div className="memory-tree-folder-count">
                        {children.length} {children.length === 1 ? 'node' : 'nodes'}
                      </div>
                      {children.length > 0 ? (
                        <ul className="memory-tree-children">
                          {children.map((child) => (
                            <li key={child.id} className="memory-tree-child">
                              <span className="memory-tree-child-info">
                                <span className="memory-tree-child-name">{child.name}</span>{' '}
                                <Badge variant="neutral" size="sm">{child.id}</Badge>
                                {child.description ? (
                                  <span className="memory-tree-child-desc">
                                    {child.description}
                                  </span>
                                ) : null}
                              </span>
                              <IconButton
                                aria-label={t('settings.memoryEdit')}
                                size="sm"
                                variant="ghost"
                                onClick={() => void startEdit(child.id)}
                              >
                                <Icon name="Pencil" size={16} />
                              </IconButton>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </Card>
                  );
                })}
              </div>
            </details>
          ) : null}

          {/* Saved-fact list (Req 20.1) */}
          <ScrollArea className="memory-unified-list">
            {unifiedMemoryCount === 0 ? (
              /* Empty state — disables search and prune (Req 20.2) */
              <EmptyState
                icon={<Icon name="Brain" size={24} />}
                title={t('settings.memoryEmpty')}
                description="Tell the assistant a fact in chat and it will be saved here automatically."
                action={
                  <Button variant="secondary" size="sm" onClick={startNew}>
                    Add a fact
                  </Button>
                }
              />
            ) : (
              <>
                {filtered.map(renderMemoryEntry)}
                {visibleExtractions.map(renderExtractionCard)}
              </>
            )}
          </ScrollArea>
        </div>
      </section>

      {/* ── Advanced section ─────────────────────────────────────────── */}
      <section className="settings-section settings-section-card memory-advanced-section">
        <details className="memory-advanced">
          <summary className="memory-details-summary">
            <span className="memory-details-title">Advanced</span>
          </summary>
          <p className="memory-advanced-hint">
            Inspect or edit the underlying memory index.
          </p>
          <div className="memory-advanced-stack">
            <details className="memory-advanced-card">
              <summary className="memory-details-summary">
                <span className="memory-details-title">
                  {t('settings.memoryIndex')}
                </span>
              </summary>
              <Textarea
                value={indexDraft ?? index}
                onChange={(e) => setIndexDraft(e.target.value)}
                rows={8}
                className="memory-index-textarea"
              />
              <div className="memory-index-footer">
                <span
                  className={`memory-index-hint${indexDraft !== null ? ' is-unsaved' : ''}`}
                >
                  {indexDraft !== null
                    ? `● ${t('settings.memoryIndexUnsaved')} — ${t('settings.memoryIndexSaveHint')}`
                    : t('settings.memoryIndexSaveHint')}
                </span>
                <div className="memory-index-footer-actions">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIndexDraft(null)}
                    disabled={indexDraft === null}
                  >
                    {t('settings.memoryIndexReset')}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={busy}
                    disabled={busy || indexDraft === null}
                    onClick={() => void onSaveIndex()}
                  >
                    {t('settings.memoryIndexSave')}
                  </Button>
                </div>
              </div>
            </details>
          </div>
        </details>
      </section>
    </>
  );
}
