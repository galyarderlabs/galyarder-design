# presenter-mode-reveal · Presenter mode template

A full-deck template designed for **technical talks driven by a speaker script**. The headline feature is a genuinely usable **magnetic-card presenter view**: current-slide iframe preview + next-slide iframe preview + a large speaker script + a timer — four cards you can drag and resize freely, all built into `runtime.js` with zero dependencies.

## When to use

- Tech talks (30–60 min)
- Product launch keynotes
- Course lectures
- Any formal speaking situation where you **need the deck to guide you, but you can't read from a script**

## Quick start

```bash
cp -r templates/full-decks/presenter-mode-reveal examples/my-talk
open examples/my-talk/index.html
```

## Keyboard shortcuts

| Key | Action |
|---|---|
| `S` | Open the presenter window (popup; original page stays in audience view) |
| `T` | Cycle theme (5 presets) |
| `←` `→` | Navigate |
| `Space` / `PgDn` | Next slide |
| `F` | Fullscreen |
| `O` | Overview thumbnails |
| `R` | Reset timer (presenter view only) |
| `Esc` | Close any overlay |

## Switching themes

The template ships five presentation-friendly themes in the `<html data-themes="...">` attribute:

```html
<html lang="en" data-themes="tokyo-night,dracula,catppuccin-mocha,nord,corporate-clean">
```

Press `T` to cycle. You can swap in any theme from `assets/themes/*.css`.

## Speaker-script conventions

**Write 150–300 words inside `<aside class="notes">` on each slide.** Three iron rules:

1. **Prompt signals, not lines to read** — bold the keywords, separate transitions into their own paragraphs, list data clearly
2. **150–300 words per slide** — one slide ≈ 2–3 minutes
3. **Speak it, don't write it** — "therefore" → "so"; "the aforementioned approach" → "this approach"; if it doesn't read out loud naturally, rewrite

Example:
```html
<aside class="notes">
  <p>Hi everyone, today let's talk about a <strong>problem most people overlook</strong> —...</p>
  <p>Here's the thesis: <em>building a deck and giving the talk are two different jobs</em>.</p>
  <p>I'll show three examples that prove this point...</p>
</aside>
```

Inline tags supported:
- `<strong>` — highlighted (orange)
- `<em>` — italic emphasis (blue)
- `<code>` — monospace
- `<p>` — separate paragraphs (aim for 30–60 seconds of spoken content per paragraph)

## File layout

```
presenter-mode-reveal/
├── index.html       # 6 example slides, full speaker script on every page
├── style.css        # scoped .tpl-presenter-mode-reveal styles
└── README.md        # this file
```

## Customizing / extending

- **Add a slide:** copy any `<section class="slide">` block, replace the content and `<aside class="notes">`
- **Switch themes:** edit `data-themes`, or change `<link id="theme-link" href="...">` directly
- **Tweak styles:** edit `style.css` only — don't touch the root `assets/base.css`
- **Add animations:** drop `data-anim="fade-up"` (or others) on elements (see `references/animations.md`)

## The four cards in the presenter window

After pressing `S` the popup contains:

- 🔵 **CURRENT** — current-slide iframe preview (loads the page in `?preview=N` mode — pixel-perfect, same CSS / theme / fonts as the audience view)
- 🟣 **NEXT** — next-slide preview, so you can prep the transition
- 🟠 **SPEAKER SCRIPT** — large-font scrollable script
- 🟢 **TIMER** — elapsed time + page number + Prev / Next / Reset buttons

Card interactions:
- **Drag the card header** (colored-dot title bar) → move the card
- **Drag the bottom-right handle** → resize
- Position + size auto-saved to localStorage; restored on next open
- The "Reset layout" button at the bottom restores the default arrangement

Smooth navigation: each iframe loads once; subsequent slide changes go via `postMessage` to switch the visible slide — **no reload, no flicker**. Both windows stay in sync via `BroadcastChannel`.

## Notes

- **The audience never sees `.notes` content** — it's `display:none` by default, only the presenter view reveals it
- **Don't put presenter-only text on the slide itself** — every prompt must live inside `<aside class="notes">`
- **Dual-screen flow:** open `index.html`, press `S`, drag the audience window onto the projector / external screen and press `F`, leave the presenter window on your own screen
