# Cloud Dashboard + Local Daemon — End-to-End Plan

**Status:** Draft / for understanding · **Parent:** [`../architecture.md`](../architecture.md) (Topology B) · [`../spec.md`](../spec.md) §10

> Goal in one sentence: **web dashboard hidup di Cloudflare (Worker + Static
> Assets), tapi tetap bisa "menyentuh" komputer kamu untuk mendeteksi &
> menjalankan coding agent lokal (claude / codex / cursor) lewat sebuah
> tunnel.**

This document is a map, not code. It explains *what each piece is*, *why it
lives where it lives*, and *what concrete actions* turn the current
all-local app into a cloud-dashboard + local-daemon split.

---

## 0. The one rule that shapes everything

```
The DAEMON cannot move to the cloud. Only the UI can.
```

Why — verified against this repo:

| Daemon does this | Needs | Possible on Cloudflare Worker? |
|---|---|---|
| `spawn` claude / codex / cursor | `child_process` | NO — V8 isolate, no processes |
| "detect local agents" (scan `$PATH`) | local OS | NO — no OS, no shell |
| read/write project files | filesystem | NO — no disk (KV/R2/D1 only) |
| long-running session per tab | persistent process | NO — per-request, then dies |

A Cloudflare Worker is a **V8 isolate at the edge**: per-request JS/Wasm, no
filesystem, no `spawn`, no long-running process. Great for serving the UI and
acting as a gateway — useless as the daemon. So the daemon stays on your
machine; the cloud only ever holds the UI (and optionally a thin proxy).

---

## 1. Target topology (the picture)

```
                          ☁  CLOUDFLARE EDGE
        ┌───────────────────────────────────────────────┐
        │                                               │
 you ──►│  Cloudflare Worker  (+ Static Assets)         │
 (any   │  ┌─────────────────────────────────────────┐  │
 device)│  │ serves apps/web build (out/)  ← the UI   │  │
        │  │ optional: /api/* proxy + auth gateway    │  │
        │  └──────────────────┬──────────────────────┘  │
        └─────────────────────┼─────────────────────────┘
                              │  https + Authorization: Bearer <TOKEN>
                              │  (SSE for /api/runs streaming)
                              ▼
        ┌───────────────────────────────────────────────┐
        │  Cloudflare Tunnel  (cloudflared)             │
        │  daemon.galyarder.dev  ──►  localhost:7456    │
        └─────────────────────┬─────────────────────────┘
                              ▼
        💻  YOUR LAPTOP (stays on, daemon running)
        ┌───────────────────────────────────────────────┐
        │  gd daemon                                    │
        │   • GD_BIND_HOST=0.0.0.0  GD_API_TOKEN=…       │
        │   • detects claude / codex / cursor on $PATH   │
        │   • spawns the agent, streams output (SSE)     │
        │   • reads/writes project files in .gd/         │
        └───────────────────────────────────────────────┘
```

Three trust zones, on purpose:

- **Cloud (Worker):** holds *no* secrets about your machine. Just UI bytes
  (and maybe a token it injects server-side). Publicly reachable.
- **Tunnel (cloudflared):** the only thing that punches from public internet
  to your laptop. No router ports opened.
- **Laptop (daemon):** holds everything sensitive — your CLIs, your files,
  your API keys in `media-config.json`.

---

## 2. What ALREADY exists vs what we BUILD

I checked the code. Here's the honest split.

### ✅ Already in the repo (no work needed)

| Capability | Where | Note |
|---|---|---|
| Daemon binds to a public interface | `GD_BIND_HOST` in `apps/daemon/src/server.ts`, `cli.ts` | default `127.0.0.1` |
| Refuses unsafe public bind | `server.ts` (~L3144) | won't start on non-loopback host without a token |
| Bearer-token auth on `/api/*` | `server.ts` (~L3162) | active when `GD_API_TOKEN` set; loopback exempt |
| CORS allow-list | `GD_ALLOWED_ORIGINS` in `apps/daemon/src/origin-validation.ts` | comma-separated https origins |
| Static-export web build | `apps/web/next.config.ts` (`output: 'export'` → `out/`) | SPA, all data via `/api/*` |
| Topology B is a sanctioned design | `docs/architecture.md` | this plan implements it |

### 🔨 What we have to build

| # | Work item | Why it's needed |
|---|---|---|
| **A** | **"Connect daemon" layer in `apps/web`** | Today the web fetches **hardcoded relative `/api/*`** in dozens of files (e.g. `providers/registry.ts`, `App.tsx`). On Cloudflare there is no daemon at the same origin — those calls 404. We need one configurable base URL + a Bearer header on every request. |
| **B** | **Cloudflare Worker project** (`wrangler`) | Serve the `out/` build via Static Assets. Optionally proxy `/api/*` → tunnel and inject the token server-side so the browser never sees it. |
| **C** | **Tunnel runbook + `--expose` helper** | Document/automate `cloudflared` so the daemon gets a stable public hostname. Spec already lists `gd daemon --expose` as a v1 helper. |
| **D** | **End-to-end verification** | Prove a real flow: cloud UI → tunnel → laptop daemon spawns claude and streams back. |

---

## 3. The data flow, request by request

What happens when you click "Generate" in the cloud UI:

```
1. Browser (cloud UI)  ──►  Worker
   POST /api/runs                 body: { prompt, agent, … }

2. Worker  ──►  Tunnel  ──►  Daemon
   POST https://daemon.galyarder.dev/api/runs
   Authorization: Bearer <GD_API_TOKEN>      ← injected by Worker (KV) OR
                                               carried from browser (simpler)

3. Daemon (laptop)
   • validates Origin against GD_ALLOWED_ORIGINS
   • validates Bearer against GD_API_TOKEN
   • spawns `claude -p "<prompt>" …`
   • streams stdout as SSE events

4. SSE stream  Daemon ──► Tunnel ──► Worker ──► Browser
   text_delta, tool_use, tool_result, usage, …
   (must stay UNBUFFERED end-to-end — see §5)
```

Two valid auth shapes (pick one in §4):

```
Shape 1 — browser holds token (simplest)
  Browser ──Bearer──► Worker (passthrough) ──Bearer──► Daemon
  ✗ token lives in browser storage

Shape 2 — Worker holds token (more secure)
  Browser ──session cookie──► Worker ──(adds Bearer from KV)──► Daemon
  ✓ token never reaches the browser
```

---

## 4. Phased action plan

Each phase is independently testable. Don't start the next until the current
one is green.

### Phase 0 — Prove it works with ZERO code (today)

Goal: see the existing daemon answer from the public internet.

```bash
# on the laptop
GD_BIND_HOST=0.0.0.0 \
GD_API_TOKEN=$(openssl rand -hex 32) \
GD_ALLOWED_ORIGINS=https://dash.galyarder.dev \
gd daemon

# in another shell — expose it
cloudflared tunnel --url http://localhost:7456
# prints e.g. https://random-words.trycloudflare.com
```

Test from anywhere:

```bash
curl https://<tunnel-host>/api/health                       # should 200 (open)
curl https://<tunnel-host>/api/agents                       # should 401
curl -H "Authorization: Bearer <TOKEN>" \
     https://<tunnel-host>/api/agents                       # should 200 + agent list
```

✅ Exit criteria: the `Bearer` call returns your locally-detected agents.
This proves the whole laptop side already works.

### Phase A — "Connect daemon" in the web app

The real engineering. Make the SPA point at a remote daemon.

- Introduce a single **API base resolver** (e.g. `apiUrl(path)`) and a
  **fetch wrapper** that adds `Authorization: Bearer <token>` when a remote
  daemon is configured.
- Replace the scattered hardcoded `fetch('/api/...')` calls with the wrapper.
  (This is the bulk of the work — it's spread across many files today.)
- Add a **Connect screen**: inputs for daemon URL + token, a "Test
  connection" button that hits `/api/health` then `/api/agents`, and persist
  to `localStorage`.
- Same-origin/desktop mode must keep working: if no remote daemon is set,
  fall back to relative `/api/*` (today's behavior).

✅ Exit criteria: run `apps/web` locally pointed at the Phase-0 tunnel URL and
drive a full chat run against the remote daemon.

### Phase B — Cloudflare Worker

- Scaffold a `wrangler` project that serves the `apps/web` `out/` build via
  **Static Assets**.
- Decide auth shape (§3). If Shape 2: store token in **Workers KV / Secret**,
  add a `/api/*` proxy route that injects the Bearer and forwards to the
  tunnel host, and stream SSE through untouched.
- Wire the build: `next build` (static export) → `wrangler deploy`.

✅ Exit criteria: the public Worker URL serves the dashboard and a run reaches
the laptop daemon.

### Phase C — Tunnel hardening + helper

- Replace the throwaway `trycloudflare.com` URL with a **named tunnel** bound
  to a stable hostname (`daemon.galyarder.dev`).
- Add `gd daemon --expose` (spec'd) to start the daemon + cloudflared and
  print the URL + token in one step.
- Document the whole runbook in `README` / `QUICKSTART`.

✅ Exit criteria: one command on the laptop, paste URL+token once in the UI,
done.

### Phase D — Verify end-to-end

- Daemon on laptop, UI on Worker, real agent run, SSE streaming verified.
- Confirm token never logged; confirm `GD_ALLOWED_ORIGINS` rejects other
  origins; confirm health probe stays open but everything else is gated.

---

## 5. Sharp edges (read before building)

- **SSE must stay unbuffered the whole way.** `/api/runs` streams Server-Sent
  Events. The daemon already sends `Cache-Control: no-transform` and
  `X-Accel-Buffering: no` (see `docs/architecture.md`), but any proxy in the
  middle (Worker, tunnel) must not buffer or gzip the stream or live output
  freezes. Test streaming explicitly, not just request/response.
- **CORS is real.** The browser origin (Worker domain) must be in
  `GD_ALLOWED_ORIGINS` on the daemon, or preflight fails.
- **Token exposure.** Shape 1 puts the token in browser storage (XSS risk).
  Shape 2 keeps it in the Worker. Start with Shape 1 to ship, move to Shape 2
  before sharing the dashboard with anyone else.
- **Laptop must be awake.** If the laptop sleeps or the daemon stops, the
  cloud UI has nothing to talk to. This is inherent to "cloud UI + local
  compute," not a bug.
- **Single-tenant only.** Auth today is one shared `GD_API_TOKEN`. Multi-user
  (per-user login, RBAC) is explicitly out of scope (`docs/plugins-spec.md`
  §18).

---

## 6. How this relates to the broken image previews

Separate problem, but this plan helps. The gallery previews currently point at
`raw.githubusercontent.com/galyarderlabs/galyarder-design/...` (404 until the
repo is public). Once the daemon is the thing serving the app, the cleaner fix
is to **serve those preview assets from the local daemon** (`assets/prompt-
templates/**`) instead of depending on a public GitHub repo. That removes the
"repo must be public forever" dependency entirely. Tracked separately from this
plan.

---

## 7. TL;DR decision points for you

1. **Auth shape** — start simple (token in browser) or secure (token in
   Worker KV)?
2. **Which web app** — `apps/web` (the real React dashboard; this plan assumes
   it) or `apps/landing-page` (marketing only)?
3. **Worker role** — static-only (UI just calls the tunnel directly) or
   static + proxy/gateway (UI calls the Worker, Worker calls the tunnel)?

Recommended starting point: **Phase 0 now** (proves the laptop side with zero
code), then **Phase A** (the actual blocker), then decide Worker role.
