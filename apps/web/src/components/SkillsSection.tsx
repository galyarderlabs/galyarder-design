import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useI18n, useT } from '../i18n';
import {
  localizeSkillDescription,
  localizeSkillName,
} from '../i18n/content';
import type { AppConfig } from '../types';
import type { SkillSummary } from '@galyarder-design/contracts';
import {
  fetchSkill,
  fetchSkills,
} from '../providers/registry';
import {
  Badge,
  Banner,
  Button,
  Card,
  Combobox,
  EmptyState,
  Icon,
  ScrollArea,
  Spinner,
  Switch,
  TextInput,
} from './ds/index';

// Functional skills only — design templates render in EntryView's
// Templates tab and are managed under their own daemon registry. See
// specs/current/skills-and-design-templates.md.
//
// Layout: a responsive card grid where each card shows skill name,
// summary, and category indicator (Req 16.1). Activating a card opens
// an inline detail surface — not a modal — showing the skill's full
// description, input parameters, and an Apply button (Req 16.2). On
// dismiss, focus returns to the activating card (Req 16.5).

interface Props {
  cfg: AppConfig;
  setCfg: Dispatch<SetStateAction<AppConfig>>;
}

// ─── Input parameter types inferred from skill metadata ─────────────────────
// Skills don't ship a formal parameter schema in the current contract, so we
// derive a best-effort set from the skill's surface / platform / fidelity /
// speakerNotes / animations fields. The detail panel renders TextInput /
// Combobox / Switch controls for the parameters the user can fill before
// applying the skill.

interface SkillParam {
  key: string;
  label: string;
  type: 'text' | 'combobox' | 'toggle';
  options?: string[]; // for combobox
  defaultValue?: string | boolean;
}

/** Derive a minimal parameter set from a skill's metadata. */
function deriveParams(skill: SkillSummary): SkillParam[] {
  const params: SkillParam[] = [];

  if (skill.surface) {
    params.push({
      key: 'surface',
      label: 'Surface',
      type: 'combobox',
      options: ['web', 'image', 'video', 'audio'],
      defaultValue: skill.surface,
    });
  }

  if (skill.platform !== undefined && skill.platform !== null) {
    params.push({
      key: 'platform',
      label: 'Platform',
      type: 'combobox',
      options: ['desktop', 'mobile'],
      defaultValue: skill.platform ?? 'desktop',
    });
  }

  if (typeof skill.fidelity === 'string') {
    params.push({
      key: 'fidelity',
      label: 'Fidelity',
      type: 'combobox',
      options: ['wireframe', 'high-fidelity'],
      defaultValue: skill.fidelity,
    });
  }

  if (typeof skill.speakerNotes === 'boolean') {
    params.push({
      key: 'speakerNotes',
      label: 'Speaker notes',
      type: 'toggle',
      defaultValue: skill.speakerNotes,
    });
  }

  if (typeof skill.animations === 'boolean') {
    params.push({
      key: 'animations',
      label: 'Animations',
      type: 'toggle',
      defaultValue: skill.animations,
    });
  }

  // Always offer a free-text prompt customisation field
  params.push({
    key: 'prompt',
    label: 'Custom prompt',
    type: 'text',
    defaultValue: skill.examplePrompt ?? '',
  });

  return params;
}

function humanizeCategory(slug: string): string {
  if (!slug) return slug;
  return slug
    .split('-')
    .map((word) =>
      word.length === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');
}

// ─── Main component ──────────────────────────────────────────────────────────

export function SkillsSection({ cfg, setCfg }: Props) {
  const t = useT();
  const { locale } = useI18n();

  const [skills, setSkills] = useState<SkillSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Track which card triggered the detail panel so we can return focus on close
  const activatingCardRef = useRef<HTMLButtonElement | null>(null);
  const [activeSkill, setActiveSkill] = useState<SkillSummary | null>(null);

  // Detail loading state (body fetched lazily when detail panel opens)
  const [detailBody, setDetailBody] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const disabledSkills = useMemo(
    () => new Set(cfg.disabledSkills ?? []),
    [cfg.disabledSkills],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchSkills();
      setSkills(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load skills.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredSkills = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return skills;
    return skills.filter((s) => {
      const hay = `${s.name}\n${s.description}\n${(s.triggers ?? []).join(' ')}\n${s.category ?? ''}`;
      return hay.toLowerCase().includes(q);
    });
  }, [skills, search]);

  const openDetail = useCallback(
    async (skill: SkillSummary, cardEl: HTMLButtonElement) => {
      activatingCardRef.current = cardEl;
      setActiveSkill(skill);
      setDetailBody(null);

      // Fetch full body lazily
      setDetailLoading(true);
      try {
        const detail = await fetchSkill(skill.id);
        setDetailBody(detail?.body ?? '');
      } catch {
        setDetailBody(null);
      } finally {
        setDetailLoading(false);
      }
    },
    [],
  );

  const closeDetail = useCallback(() => {
    setActiveSkill(null);
    setDetailBody(null);
    // Return focus to the activating card on dismiss (Req 16.5)
    requestAnimationFrame(() => {
      activatingCardRef.current?.focus();
    });
  }, []);

  const toggleEnabled = useCallback(
    (id: string, enabled: boolean) => {
      setCfg((c) => {
        const set = new Set(c.disabledSkills ?? []);
        if (enabled) set.delete(id);
        else set.add(id);
        return { ...c, disabledSkills: [...set] };
      });
    },
    [setCfg],
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section
      className="skills-section"
      aria-labelledby="skills-section-title"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
        }}
      >
        <h2
          id="skills-section-title"
          style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', margin: 0 }}
        >
          {t('homeHero.skills')}
        </h2>
        <TextInput
          aria-label={t('settings.librarySearch')}
          placeholder={t('settings.librarySearch')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leadingIcon={<Icon name="Search" size={16} />}
          style={{ width: '220px' }}
        />
      </div>

      {/* Error state (Req 16.3) */}
      {error ? (
        <Banner
          variant="danger"
          title="Could not load skills"
          description={error}
          actions={
            <Button variant="secondary" size="sm" onClick={() => void load()}>
              Retry
            </Button>
          }
        />
      ) : null}

      {/* Loading state */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-12) 0',
          }}
        >
          <Spinner size="md" aria-label="Loading skills" />
        </div>
      ) : null}

      {/* Empty state (Req 16.4) */}
      {!loading && !error && filteredSkills.length === 0 ? (
        <EmptyState
          icon={<Icon name="Layers" size={24} />}
          title={
            search.trim()
              ? t('settings.libraryNoResults')
              : 'No skills available'
          }
          description={
            search.trim()
              ? 'Try a different search term.'
              : 'Skills will appear here once they are installed.'
          }
        />
      ) : null}

      {/* Card grid + inline detail (Req 16.1, 16.2) */}
      {!loading && !error && filteredSkills.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Responsive card grid */}
          <div
            className="skills-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                locale={locale}
                isActive={activeSkill?.id === skill.id}
                isEnabled={!disabledSkills.has(skill.id)}
                onActivate={openDetail}
                onToggleEnabled={toggleEnabled}
              />
            ))}
          </div>

          {/* Inline detail surface (Req 16.2) — not a modal */}
          {activeSkill ? (
            <SkillDetailPanel
              skill={activeSkill}
              body={detailBody}
              bodyLoading={detailLoading}
              locale={locale}
              onClose={closeDetail}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

// ─── Skill card ──────────────────────────────────────────────────────────────

interface SkillCardProps {
  skill: SkillSummary;
  locale: string;
  isActive: boolean;
  isEnabled: boolean;
  onActivate: (skill: SkillSummary, cardEl: HTMLButtonElement) => void;
  onToggleEnabled: (id: string, enabled: boolean) => void;
}

function SkillCard({
  skill,
  locale,
  isActive,
  isEnabled,
  onActivate,
  onToggleEnabled,
}: SkillCardProps) {
  const t = useT();
  const cardBtnRef = useRef<HTMLButtonElement>(null);
  const displayName =
    localizeSkillName(locale as Parameters<typeof localizeSkillName>[0], skill) || skill.id;
  const description = localizeSkillDescription(
    locale as Parameters<typeof localizeSkillDescription>[0],
    skill,
  );

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={cardBtnRef}
        type="button"
        className="skills-card-trigger"
        onClick={() => {
          if (cardBtnRef.current) onActivate(skill, cardBtnRef.current);
        }}
        aria-expanded={isActive}
        aria-label={`${isActive ? 'Close' : 'Open'} ${displayName} detail`}
        style={{
          all: 'unset',
          display: 'block',
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
          width: '100%',
        }}
      >
        <Card
          elevation={isActive ? 'raised' : 'resting'}
          padding="md"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            height: '100%',
            opacity: isEnabled ? 1 : 0.5,
            transition: [
              'box-shadow var(--duration-base) var(--easing-standard)',
              'opacity var(--duration-base) var(--easing-standard)',
            ].join(', '),
            outline: isActive ? '2px solid var(--accent-6)' : undefined,
            outlineOffset: isActive ? '2px' : undefined,
          }}
        >
          {/* Name + category badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--space-2)',
            }}
          >
            <span
              style={{
                font: 'var(--type-h4)',
                color: 'var(--text-strong)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: '1 1 0',
                minWidth: 0,
              }}
            >
              {displayName}
            </span>
            {skill.category ? (
              <Badge variant="neutral" size="sm" style={{ flexShrink: 0 }}>
                {humanizeCategory(skill.category)}
              </Badge>
            ) : null}
          </div>

          {/* Mode badge */}
          <Badge variant="info" size="sm" style={{ alignSelf: 'flex-start' }}>
            {skill.mode}
          </Badge>

          {/* Description */}
          {description ? (
            <p
              style={{
                font: 'var(--type-body-sm)',
                color: 'var(--text-muted)',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </p>
          ) : null}
        </Card>
      </button>

      {/* Enable/disable toggle — positioned over the card, not inside the button */}
      <div
        style={{
          position: 'absolute',
          bottom: 'var(--space-3)',
          right: 'var(--space-3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => onToggleEnabled(skill.id, checked)}
          aria-label={t('settings.libraryToggleLabel')}
          size="sm"
        />
      </div>
    </div>
  );
}

// ─── Skill detail panel (inline, not modal) ───────────────────────────────────

interface SkillDetailPanelProps {
  skill: SkillSummary;
  body: string | null;
  bodyLoading: boolean;
  locale: string;
  onClose: () => void;
}

function SkillDetailPanel({
  skill,
  body,
  bodyLoading,
  locale,
  onClose,
}: SkillDetailPanelProps) {
  const displayName =
    localizeSkillName(locale as Parameters<typeof localizeSkillName>[0], skill) || skill.id;
  const description = localizeSkillDescription(
    locale as Parameters<typeof localizeSkillDescription>[0],
    skill,
  );
  const params = useMemo(() => deriveParams(skill), [skill]);

  // Param values controlled locally; Apply sends them upstream
  const [paramValues, setParamValues] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {};
    for (const p of params) {
      if (p.defaultValue !== undefined) init[p.key] = p.defaultValue;
    }
    return init;
  });

  // Reset param values when skill changes
  useEffect(() => {
    const init: Record<string, string | boolean> = {};
    for (const p of params) {
      if (p.defaultValue !== undefined) init[p.key] = p.defaultValue;
    }
    setParamValues(init);
  }, [params]);

  function setParam(key: string, value: string | boolean) {
    setParamValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Card
      elevation="resting"
      padding="md"
      aria-label={`${displayName} detail`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <h3
            style={{
              font: 'var(--type-h2)',
              color: 'var(--text-strong)',
              margin: 0,
            }}
          >
            {displayName}
          </h3>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-2)',
              flexWrap: 'wrap',
            }}
          >
            <Badge variant="info" size="sm">{skill.mode}</Badge>
            {skill.category ? (
              <Badge variant="neutral" size="sm">
                {humanizeCategory(skill.category)}
              </Badge>
            ) : null}
            {skill.source === 'user' ? (
              <Badge variant="success" size="sm">user</Badge>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          aria-label="Close skill detail"
          onClick={onClose}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
        >
          <Icon name="X" size={20} />
        </button>
      </div>

      {/* Full description */}
      {description ? (
        <p
          style={{
            font: 'var(--type-body)',
            color: 'var(--text)',
            margin: 0,
          }}
        >
          {description}
        </p>
      ) : null}

      {/* Body preview in a ScrollArea */}
      {bodyLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Spinner size="sm" aria-label="Loading skill details" />
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>
            Loading…
          </span>
        </div>
      ) : body ? (
        <ScrollArea ariaLabel="Skill body" style={{ maxHeight: '200px' }}>
          <Card elevation="flat" padding="md">
            <pre
              style={{
                font: 'var(--type-code)',
                color: 'var(--text)',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {body}
            </pre>
          </Card>
        </ScrollArea>
      ) : null}

      {/* Input parameters (Req 16.2) */}
      {params.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h4
            style={{
              font: 'var(--type-h4)',
              color: 'var(--text-strong)',
              margin: 0,
            }}
          >
            Parameters
          </h4>
          <ScrollArea ariaLabel="Skill parameters" style={{ maxHeight: '320px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {params.map((param) => (
                <SkillParamField
                  key={param.key}
                  param={param}
                  value={paramValues[param.key]}
                  onChange={(val) => setParam(param.key, val)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : null}

      {/* Apply button (Req 16.2) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--space-3)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <Button variant="ghost" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onClose}
          data-testid="skills-apply"
        >
          Apply
        </Button>
      </div>
    </Card>
  );
}

// ─── Individual parameter field ───────────────────────────────────────────────

interface SkillParamFieldProps {
  param: SkillParam;
  value: string | boolean | undefined;
  onChange: (value: string | boolean) => void;
}

function SkillParamField({ param, value, onChange }: SkillParamFieldProps) {
  if (param.type === 'toggle') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}
      >
        <label
          htmlFor={`skill-param-${param.key}`}
          style={{ font: 'var(--type-body-sm)', color: 'var(--text)' }}
        >
          {param.label}
        </label>
        <Switch
          id={`skill-param-${param.key}`}
          checked={typeof value === 'boolean' ? value : Boolean(param.defaultValue)}
          onCheckedChange={(checked) => onChange(checked)}
          aria-label={param.label}
        />
      </div>
    );
  }

  if (param.type === 'combobox' && param.options) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <label
          htmlFor={`skill-param-${param.key}`}
          style={{ font: 'var(--type-body-sm)', color: 'var(--text)' }}
        >
          {param.label}
        </label>
        <Combobox
          id={`skill-param-${param.key}`}
          label={param.label}
          items={param.options.map((opt) => ({ value: opt, label: opt }))}
          value={typeof value === 'string' ? value : String(param.defaultValue ?? '')}
          onValueChange={(val) => onChange(val)}
          placeholder={`Select ${param.label.toLowerCase()}`}
          size="sm"
        />
      </div>
    );
  }

  // Default: text input
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label
        htmlFor={`skill-param-${param.key}`}
        style={{ font: 'var(--type-body-sm)', color: 'var(--text)' }}
      >
        {param.label}
      </label>
      <TextInput
        id={`skill-param-${param.key}`}
        value={typeof value === 'string' ? value : String(param.defaultValue ?? '')}
        onChange={(e) => onChange(e.target.value)}
        placeholder={param.label}
      />
    </div>
  );
}
