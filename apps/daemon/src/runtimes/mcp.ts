import type { RuntimeAgentDef } from './types.js';

type McpOptions = {
  enabled?: boolean;
  command?: string;
  argsPrefix?: string[];
};

export function buildLiveArtifactsMcpServersForAgent(
  def: RuntimeAgentDef,
  { enabled = true, command = 'gd', argsPrefix = [] }: McpOptions = {},
) {
  if (!enabled || def?.mcpDiscovery !== 'mature-acp') return [];
  return [
    {
      name: 'galyarder-design-live-artifacts',
      command,
      args: [...argsPrefix, 'mcp', 'live-artifacts'],
      env: [{ name: 'ELECTRON_RUN_AS_NODE', value: '1' }],
    },
  ];
}
