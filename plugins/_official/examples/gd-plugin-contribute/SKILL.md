---
name: gd-plugin-contribute-galyarder-design
description: Open a pull request adding a local Galyarder Design plugin to the Galyarder Design community catalog using gh CLI.
triggers:
  - contribute plugin
  - galyarder design pr
  - github pull request
od:
  mode: utility
  platform: desktop
  scenario: plugin-sharing
---

# Contribute Plugin to Galyarder Design

Use this workflow when the active project contains a copied plugin folder and the user wants to propose it for the Galyarder Design community catalog.

## Workflow

1. Read the active plugin inputs. `plugin_context_path` is the copied plugin folder relative to the project working directory.
2. Inspect the copied plugin's manifest, skill instructions, examples, and compatibility metadata.
3. Call the local daemon endpoint instead of hand-rolling GitHub commands:
   `curl -sS -X POST "$GD_DAEMON_URL/api/projects/$GD_PROJECT_ID/plugins/contribute-galyarder-design" -H 'content-type: application/json' -d '{"path":"<plugin_context_path>"}'`
4. Read the JSON response. If `ok` is true, report the PR URL, branch name when present in the log, and any useful validation summary.
5. If the endpoint fails, report its `message`, `code`, and useful log lines. When authentication is missing, tell the user to run `gh auth login --hostname github.com`.

Keep the pull request focused. Do not modify unrelated Galyarder Design files unless a manifest validation issue requires a tiny supporting change.
