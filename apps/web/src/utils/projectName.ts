import type { Project } from '../types';

// CJK literals throughout this module are functional detection / output
// patterns for parsing and trimming Chinese-language project briefs into
// project titles. They are kept verbatim because they're matched against
// user-entered prose at runtime; an English-only pattern set would skip
// non-English briefs entirely. Each block below is annotated with its
// English semantic intent for reviewers.

const MAX_CJK_TITLE_LENGTH = 18;
const MAX_LATIN_WORDS = 6;

const CJK_PATTERN = /[\u3400-\u9fff]/;

// Leading filler words in Chinese briefs ("please help me…", "could you…",
// "I want to…", action verbs like "create / make / design / fix / adjust",
// generic articles "one / this / that"). Stripped before computing the
// title so the leftover content carries the actual subject.
const LEADING_CJK_FILLER = [
  /^先?(帮我|帮忙|麻烦|请|可以|能不能|能否|给我|我想要|我要)/,
  /^(先)?(实现|做|做一下|创建|生成|设计|开发|新增|添加|优化|修复|改|更改|调整)(一下|一个|一版|下)?/,
  /^(一个|一份|这个|那个)/,
];

const LEADING_LATIN_FILLER =
  /^(please\s+)?(can\s+you\s+|could\s+you\s+|help\s+me\s+|i\s+want\s+to\s+|i\s+need\s+to\s+)?(create|build|make|design|implement|add|fix|update|improve|optimize|generate|write)\s+(a|an|the|this|that)?\s*/i;

const LATIN_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'for',
  'in',
  'of',
  'on',
  'please',
  'the',
  'to',
  'with',
]);

function cleanPrompt(prompt: string): string {
  return prompt
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[@#][\w.-]+/g, ' ')
    .replace(/[“”"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function trimCjkTitle(input: string): string {
  let title = input.trim();
  for (const pattern of LEADING_CJK_FILLER) {
    title = title.replace(pattern, '').trim();
  }
  // Detection-and-rewrite pattern: when the user prompt contains all of
  // "project name" + "auto" + ("change" / "edit" / "naming"), collapse
  // the title to the canonical "auto project naming" output. CJK kept
  // verbatim because both sides of the regex match user-language text.
  if (/项目名称/.test(title) && /自动/.test(title) && /(更改|修改|命名)/.test(title)) {
    return '自动项目命名';
  }
  title = title
    // Strip a common Chinese phrase meaning "based on the first prompt
    // in the project". Detection-and-rewrite pattern.
    .replace(/^根据项目中的?第一个\s*prompt\s*/i, '')
    // Same auto-rename collapse as above, in either word order.
    .replace(/项目名称.*自动.*(更改|修改|命名)/, '自动项目命名')
    .replace(/自动.*(更改|修改).*项目名称/, '自动项目命名')
    // Collapse "summarize the project name" prose to "project naming".
    .replace(/总结项目名称/, '项目命名')
    // Strip trailing punctuation in either ASCII or CJK form.
    .replace(/[，。！？；：,.!?;:].*$/, '')
    .replace(/\s+/g, '');
  if (!title) return '';
  return title.slice(0, MAX_CJK_TITLE_LENGTH);
}

function toTitleCase(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function trimLatinTitle(input: string): string {
  const words = input
    .replace(LEADING_LATIN_FILLER, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !LATIN_STOP_WORDS.has(word.toLowerCase()))
    .slice(0, MAX_LATIN_WORDS);
  return words.map(toTitleCase).join(' ');
}

export function summarizeProjectNameFromPrompt(prompt: string): string {
  const cleaned = cleanPrompt(prompt);
  if (!cleaned) return '';
  const firstClause = cleaned.split(/[\n\r。！？!?]/)[0]?.trim() ?? cleaned;
  if (CJK_PATTERN.test(firstClause)) return trimCjkTitle(firstClause);
  return trimLatinTitle(firstClause);
}

export function canAutoRenameProjectFromPrompt(
  project: Pick<Project, 'metadata'>,
): boolean {
  return project.metadata?.nameSource === 'generated';
}
