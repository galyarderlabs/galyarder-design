# Presenter Mode Guide

How to build a **speaker-script-driven presenter-mode deck** with the html-ppt skill.

## When to use presenter mode

Reach for presenter mode whenever the user's request involves any of these:

- Mentions "talk", "sharing session", "speaker script", "speech", "speaker notes"
- Mentions "presenter view", "presenter mode"
- Asks for a "30 minute / 45 minute / 1 hour talk"
- Says "I'm presenting xxx to the team", "I'm doing a tech talk", "I'm pitching"
- Stresses "I don't want to forget my lines", "I'm worried I won't speak fluently", "I need a teleprompter"

If the user only wants a "static, good-looking slide deck" (e.g. a RedNote image post, a product brochure, a report deck they will not present themselves), you do **not** need presenter mode.

## Two ways to do it

### ✅ Recommended: copy the `presenter-mode-reveal` template

```bash
cp -r templates/full-decks/presenter-mode-reveal examples/my-talk
```

This template is preloaded with everything you need:
- The `S` key opens presenter view
- 5 themes cycle with `T` (tokyo-night / dracula / catppuccin-mocha / nord / corporate-clean)
- Arrow keys navigate
- Every slide ships with a 150–300 word example speaker script
- Bottom-of-screen keyboard hints

Just swap in your content.

### 🔧 Advanced: add presenter mode to any existing template

The `S`-key presenter view in html-ppt is **built into `runtime.js`, so every full-deck template supports it automatically**. You only need to:

1. **Add `<aside class="notes">` to the end of each slide** (or `<div class="notes">`) and put the speaker script inside
2. **Confirm the HTML loads `assets/runtime.js`**

```html
<section class="slide">
  <h2>Your title</h2>
  <p>Content...</p>
  <aside class="notes">
    <p>This is what you say while presenting, 150-300 words...</p>
  </aside>
</section>
```

## The three iron rules of speaker scripts

This is the heart of the methodology. When the AI helps the user write a speaker script, it must obey these rules:

### Rule 1: Prompt signals, not lines to read

❌ **Wrong** (sounds like reading from a script):
```
Hello everyone, welcome to today's session. Today I'm going to introduce
the work our team has done over the past three months. First, let's
look at the background. Over the past three months we ran into the
following problems...
```

✅ **Right** (prompt signals + bolded keywords):
```
<p>Welcome! Today we're sharing what the team built in the <strong>past 3 months</strong>.</p>
<p>Start with <em>context</em> — three months ago we hit <strong>three core problems</strong>:
high latency, runaway cost, brittle stability.</p>
<p>Next, we'll walk through how each one was solved.</p>
```

**The difference:** the right version bolds the key terms, breaks transitions out into their own paragraphs, and is scannable in a single glance.

### Rule 2: 150–300 words per slide

- **Under 150 words:** not enough prompts, you'll stall mid-sentence
- **Over 300 words:** you can't scan the whole thing in time
- **2–3 minutes per slide** is the most comfortable pace

### Rule 3: Speak it, don't write it

| ❌ Written | ✅ Spoken |
|---|---|
| Therefore | So |
| The aforementioned approach | This approach |
| However | But / though |
| Conduct optimization | Optimize it |
| We shall | We'll / next |
| In conclusion | So basically |

**Test:** read it aloud once you're done. If it sounds like talking, you've got it.

## Required HTML structure

```html
<!DOCTYPE html>
<html lang="en" data-themes="tokyo-night,dracula,corporate-clean">
<head>
  <meta charset="utf-8">
  <title>...</title>
  <link rel="stylesheet" href="../../../assets/fonts.css">
  <link rel="stylesheet" href="../../../assets/base.css">
  <link rel="stylesheet" id="theme-link" href="../../../assets/themes/tokyo-night.css">
  <link rel="stylesheet" href="../../../assets/animations/animations.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="deck">

  <section class="slide" data-title="Cover">
    <h1>Your title</h1>
    <p>Subtitle</p>
    <aside class="notes">
      <p>Script paragraph 1 (with <strong>bold keywords</strong>).</p>
      <p>Script paragraph 2 (transition sentence on its own line).</p>
      <p>Script paragraph 3 (close naturally, lead into the next slide).</p>
    </aside>
  </section>

  <!-- More slides ... -->

</div>
<script src="../../../assets/runtime.js"></script>
</body>
</html>
```

## What the presenter view shows

Press `S` and a **dedicated presenter window pops open** (the original page stays as the audience view). The presenter window is **four independent magnetic cards**:

```
 Audience window (original page)        Presenter window (magnetic cards)
┌─────────────────┐   ┌─────────────────────┬──────────────────┐
│                 │   │ 🔵 CURRENT         │ 🟣 NEXT            │
│  normal slide   │   │ ━━━━━━━━━━━━━━━━ │ ━━━━━━━━━━━━━ │
│  fullscreen     │◄►│                   │  iframe preview   │
│                 │   │  iframe preview   │  (next slide)     │
│                 │   │  (current slide)  ├──────────────────┤
│                 │   │                   │ 🟠 SPEAKER SCRIPT  │
│                 │   │                   │ ━━━━━━━━━━━━━ │
│                 │   ├─────────────────────┤  [large script]  │
│                 │   │ 🟢 TIMER           │  [scrollable]     │
│                 │   │ ⏱ 12:34   3 / 8 │                   │
│                 │   │ [← Prev][Next →]  │                   │
└─────────────────┘   └─────────────────────┴──────────────────┘
       ↑ BroadcastChannel keeps both windows in sync ↑
```

Card interactions:
- **Drag the card header** (the colored-dot title bar) → move the card
- **Drag the bottom-right triangular handle** → resize the card
- **Position and size auto-save to localStorage**, restored next time you open it
- The "Reset layout" button at the bottom restores the default arrangement

Card contents:
- 🔵 **CURRENT** — pixel-perfect preview of the current slide (an iframe loading the original HTML in `?preview=N` mode — colors can't drift)
- 🟣 **NEXT** — pixel-perfect preview of the next slide
- 🟠 **SPEAKER SCRIPT** — the script, 18px font, supporting `<strong>` (orange bold), `<em>` (blue emphasis), `<code>`, etc.
- 🟢 **TIMER** — timer keeps focus, with prev/next page buttons

Two-window sync: pressing ← → in either window navigates both, kept in sync via `BroadcastChannel`.

Smooth navigation: each iframe loads once; subsequent slide changes use `postMessage` to switch the visible slide — **no reload, no flicker**.

## Keyboard shortcuts (presenter mode)

| Key | Action |
|---|---|
| `S` | Open the presenter window (pops up; original page stays in audience view) |
| `←` `→` / Space / PgDn | Navigate (works in both views) |
| `T` | Cycle themes |
| `R` | Reset the timer (presenter view only) |
| `F` | Fullscreen |
| `O` | Overview |
| `Esc` | Close any overlay |

## Standard dual-screen flow

1. Open `index.html`, press `S` → presenter window pops up
2. Drag the **audience window** (original page) to the projector / external screen, press `F` for fullscreen
3. Keep the **presenter window** (popup) on the screen in front of you
4. Navigate ← → in either window — they stay in sync
5. Use the presenter window for script + next-slide preview + timer

> 💡 **Why previews are pixel-perfect:** each preview is an `<iframe>` loading the same deck HTML, just with `?preview=N` in the URL. The runtime detects this and renders only slide N with no chrome. **The iframe uses exactly the same CSS, theme, fonts, and viewport as the audience view** — colors and layout are guaranteed identical. The outer card uses CSS `transform: scale()` to fit 1920×1080 into the card, distortion-free.

> 💡 **Why there's no flicker:** the iframe stays mounted after first load. On slide change, the presenter window posts `{type:'preview-goto', idx:N}` to the iframe. The iframe's runtime.js just toggles the `.is-active` class — **no reload, no white flash**.

## Common mistakes

### ❌ Putting the speaker script in a visible position on the slide

```html
<!-- Wrong: the audience can read this -->
<p style="font-size:12px;color:gray">
  Talk about xxx, then yyy...
</p>
```

✅ Right:
```html
<aside class="notes">
  <p>Talk about xxx, then yyy...</p>
</aside>
```

The `.notes` class is `display:none` by default — only the presenter view shows it.

### ❌ Forgetting to include runtime.js

Without `<script src="../../../assets/runtime.js"></script>` you have no `S` key, no presenter view, and no navigation.

### ❌ Writing the script in a written-prose voice

It comes out sounding like a robot. **Read it aloud once before you ship it.**

### ❌ 50 words per slide

Not enough prompts, you'll forget your lines anyway.

### ❌ 500 words per slide

Your eyes can't scan that fast — same effect as no script.

## Standard prompt for AI-generating a speaker script

> "For each slide, write a **150-300 word** speaker script and put it inside `<aside class="notes">`.
> Rules:
> 1. Use a **spoken** voice — never written prose (so / but / next, not therefore / however / in conclusion)
> 2. Wrap the **key terms** in `<strong>` to bold them
> 3. Put transition sentences on their own lines (each paragraph 1-3 sentences)
> 4. Read it aloud — it should sound like speaking, not reading
> 5. End with a natural transition that leads into the next slide"

## Recommended pairings

- **Theme:** `tokyo-night` (dark, the default for tech talks), `corporate-clean` (light, business reports), `dracula` (dark alternate)
- **Fonts:** the defaults — Noto Sans SC + JetBrains Mono — need no change
- **Animations:** keep them restrained. `fade-up` / `rise-in` feel the most natural; avoid `glitch-in` / `confetti-burst` style flourishes
- **Page count:** 30 min talk = 8–12 slides; 45 min = 12–16; 1 hour = 16–22
