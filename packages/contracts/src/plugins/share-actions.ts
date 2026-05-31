import type { Project } from '../api/projects.js';

export const PLUGIN_SHARE_ACTIONS = [
  'publish-github',
  'contribute-galyarder-design',
] as const;

export type PluginShareAction = (typeof PLUGIN_SHARE_ACTIONS)[number];

export const PLUGIN_SHARE_ACTION_PLUGIN_IDS: Record<PluginShareAction, string> = {
  'publish-github': 'gd-plugin-publish-github',
  'contribute-galyarder-design': 'gd-plugin-contribute-galyarder-design',
};

export interface CreatePluginShareProjectRequest {
  action: PluginShareAction;
  locale?: string;
}

export interface CreatePluginShareProjectResponse {
  ok: true;
  project: Project;
  conversationId: string;
  appliedPluginSnapshotId?: string;
  actionPluginId: string;
  sourcePluginId: string;
  stagedPath: string;
  prompt: string;
  message: string;
}
