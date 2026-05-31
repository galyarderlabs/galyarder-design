# Publishing An Galyarder Design Plugin

Galyarder Design registry publishing is GitHub-backed in v1. The CLI remains the
canonical workflow; the product UI and agent flows wrap these commands.

## 1. Scaffold

```bash
gd plugin scaffold --id figma-workflow --title "Figma workflow" --out ./plugins/community
```

The scaffold command creates `./plugins/community/figma-workflow/`. Plugin IDs
must be lowercase, start with a letter, and use only `[a-z0-9._-]`; slash-
separated registry paths are used by catalogs, not by `gd plugin scaffold`.
The generated `galyarder-design.json` is the Galyarder Design sidecar next to `SKILL.md`.

## 2. Validate And Pack

```bash
gd plugin validate ./plugins/community/figma-workflow --no-daemon
gd plugin pack ./plugins/community/figma-workflow
```

The registry accepts anything that validates and packs. The source repository
does not need a special layout beyond `SKILL.md` plus `galyarder-design.json`.
`gd plugin pack` writes the archive next to the plugin folder by default.

## 3. Authenticate

```bash
gd plugin login
gd plugin whoami --json
```

These commands wrap GitHub CLI. Tokens stay in `gh`; Galyarder Design does not store
GitHub credentials.

## 4. Publish

```bash
gd plugin publish figma-workflow --to galyarder-design --repo https://github.com/acme/figma-workflow
```

v1 opens the GitHub registry review flow. The publish payload includes the
plugin ID, version, repo, capability summary, and target registry entry path.
After merge, CI regenerates `galyarder-design-marketplace.json`.

## 5. Install From The Registry

```bash
od marketplace refresh official
gd plugin install figma-workflow
gd plugin info figma-workflow --json
```

Installs preserve marketplace provenance, resolved source, manifest digest, and
archive integrity. `official` and `trusted` sources install as trusted;
`restricted` sources stay restricted until the user grants more trust.

## 6. Yank A Version

```bash
gd plugin yank figma-workflow@1.0.0 --reason "Security issue"
```

Yanking never deletes metadata or bytes. New installs refuse yanked versions;
existing exact lockfile replays can still warn and proceed if the archive
remains reachable and integrity matches.
