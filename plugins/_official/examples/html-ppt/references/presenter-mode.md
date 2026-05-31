# Presenter Mode Guide

This document explains how to build an **html-ppt deck with verbatim speaker scripts** that drives the presenter view.

## When to use presenter mode

Reach for presenter mode when the user's request involves any of the following:

- They mention "**talk**", "**share**", "**script**", "**verbatim script**", "**speaker notes**".
- They mention "**presenter view**" or "**presenter mode**".
- They want a "**30-minute / 45-minute / 1-hour talk**".
- They say things like "I need to present this to the team", "I'm running a tech share", or "I'm doing a roadshow".
- They emphasize "**don't want to forget my lines**", "**worried I won't be smooth**", or "**need a teleprompter**".

If the user only wants a "static, good-looking deck" (e.g. a RedNote image-text post, a product brochure, or report slides they don't plan to present in person), **don't bother with** presenter mode.

## Two ways to do it

### ✅ Recommended: start from `presenter-mode-reveal`

```bash
cp -r templates/full-decks/presenter-mode-reveal examples/my-talk
```

This template ships every required element preconfigured:
- Press S to toggle the presenter view.
- 5 themes cycle with T (`tokyo-night` / `dracula` / `catppuccin-mocha` / `nord` / `corporate-clean`).
- Arrow keys for navigation.
- Every slide ships a 150–300 word sample script.
- Keyboard hints at the bottom.

Just swap in your content.

### 🔧 Advanced: add presenter mode to any existing template

The **S-key presenter view is built into `runtime.js`, so every full-deck template supports it automatically**. You only have to do two things:

1. **End each slide with `<aside class="notes">`** (or `<div class="notes">`) holding the verbatim script.
2. **Make sure the HTML loads `assets/runtime.js`**.

```html
<section class="slide">
  <h2>Your headline</h2>
  <p>Body copy...</p>
  <aside class="notes">
    <p>What you actually say from the stage, 150-300 words...</p>
  </aside>
</section>
```

## Three iron rules for writing scripts

This is the heart of the methodology. When the AI writes scripts on the user's behalf, it must follow these:

### Rule 1: not a script — a "cue track"

❌ **Wrong** (sounds like reading a press release):
```
Hello everyone, welcome to today's session. Today I'd like to walk you
through the work our team has done over the past three months. To start,
let's review the background. In the past three months, we encountered the
following issues...
```

✅ **Right** (cues + bolded core words):
```
<p>Welcome! Today I'm sharing what our team shipped <strong>over the last 3 months</strong>.</p>
<p>Quick <em>background</em> first — three months ago we hit <strong>three core problems</strong>:
high latency, runaway cost, shaky stability.</p>
<p>Then I'll walk through how we solved each.</p>
```

**The difference**: the right version bolds keywords, breaks transitions into their own paragraphs, and is scannable in a single glance.

### Rule 2: 150–300 words per slide

- **Under 150 words**: not enough cues — you'll stall mid-thought.
- **Over 300 words**: you'll never scan it in time.
- **2–3 minutes per slide** is the most natural cadence.

### Rule 3: speak it, don't write it

| ❌ Written-style | ✅ Spoken-style |
|---|---|
| Therefore | So |
| The aforementioned approach | This approach |
| However | But / Though |
| Conduct optimization | Tune it / Optimize it |
| We shall | We will / Next |
| In summary | So basically |

**How to check**: read the script out loud. If it sounds like talking, you're good.

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
    <h1>Your headline</h1>
    <p>Subtitle</p>
    <aside class="notes">
      <p>Script paragraph 1 (with <strong>bolded keywords</strong>).</p>
      <p>Script paragraph 2 (transition gets its own paragraph).</p>
      <p>Script paragraph 3 (natural close that sets up the next slide).</p>
    </aside>
  </section>

  <!-- More slides... -->

</div>
<script src="../../../assets/runtime.js"></script>
</body>
</html>
```

## What the presenter view shows

Press `S` and a **separate presenter window pops up** (the original page stays in audience view). The presenter window is **4 independent magnetic cards**:

```
 Audience window (the main page)        Presenter window (magnetic cards)
+---------------------+   +----------------------+--------------------+
|                     |   | (CUR) CURRENT       | (NXT) NEXT          |
|  Normal slide       |   | =================   | =================== |
|  fullscreen         |<->|                     |  iframe preview     |
|                     |   |  iframe preview     |  (next slide)       |
|                     |   |  (current slide)    +--------------------+
|                     |   |                     | (NOTES) SCRIPT      |
|                     |   |                     | =================== |
|                     |   +----------------------+  [large script]    |
|                     |   | (TIMER) TIMER       |  [scrollable]       |
|                     |   | (clock) 12:34 3/8 |                     |
|                     |   | [<- Prev][Next ->]  |                     |
+---------------------+   +----------------------+--------------------+
       ^ BroadcastChannel keeps both windows in sync ^
```

Card interaction rules:
- **Drag the card header** (the top bar with the colored dot and title) to move the card around.
- **Drag the triangle handle in the bottom-right** to resize the card.
- **Position and size auto-save to localStorage** and restore on next open.
- The "Reset layout" button at the bottom restores the default arrangement.

Card contents:
- **CURRENT** — **pixel-perfect preview** of the current slide (iframe loads the same HTML file in `?preview=N` mode, so colors can't drift).
- **NEXT** — pixel-perfect preview of the next slide.
- **SPEAKER SCRIPT** — verbatim script at 18px, with inline `<strong>` (orange bold), `<em>` (blue emphasis), `<code>`, etc.
- **TIMER** — timer never loses focus, with paging buttons.

Two-window sync: pressing ← → in either window updates the other automatically (BroadcastChannel).

Smooth navigation: each iframe loads once; subsequent navigation uses `postMessage` to switch the visible slide, **with no reload and no flicker**.

## Keyboard shortcuts (presenter mode)

| Key | Action |
|---|---|
| `S` | Open the presenter window (new pop-up; main page stays in audience view) |
| `←` `→` / Space / PgDn | Navigate (works inside the presenter view too) |
| `T` | Cycle themes |
| `R` | Reset the timer (presenter view only) |
| `F` | Fullscreen |
| `O` | Overview |
| `Esc` | Close any overlay |

## Standard dual-screen flow

1. Open `index.html`, press `S` to launch the presenter window.
2. Drag the **audience window** (the main page) to the projector / external display, then press `F` to fullscreen.
3. Keep the **presenter window** (the pop-up) on your laptop screen.
4. Press ← → in either window — both stay in sync.
5. Read the script, peek at the next slide, and watch the timer in the presenter window.

> 💡 **Why the preview is pixel-perfect**: each preview is an `<iframe>` that loads the exact same deck HTML, with `?preview=N` appended to the URL. When `runtime.js` sees that flag, it renders only slide N and hides all chrome. **The iframe uses identical CSS, theme, fonts, and viewport as the audience view**, so colors and typography match exactly. The host scales 1920×1080 down to fit the card with CSS `transform: scale()`, preserving aspect ratio.

> 💡 **Why it doesn't flicker**: the iframes stay loaded after the initial mount; the presenter window navigates by sending `postMessage({type:'preview-goto', idx:N})`. The iframe's runtime.js just toggles the `.is-active` class — **no reload, no white flash**.

## Common mistakes

### ❌ Putting the script in a visible slide region

```html
<!-- Wrong: the audience will see this text -->
<p style="font-size:12px;color:gray">
  Talk about xxx, then talk about yyy...
</p>
```

✅ Right:
```html
<aside class="notes">
  <p>Talk about xxx, then talk about yyy...</p>
</aside>
```

`.notes` defaults to `display:none` and is only visible inside the presenter view.

### ❌ Forgetting to load runtime.js

No `<script src="../../../assets/runtime.js"></script>` means no S key, no presenter view, no navigation.

### ❌ Writing the script in formal prose

It will sound like an AI bot when you read it aloud. **Always read it back to yourself once.**

### ❌ 50 words per slide

Not enough cues — you'll still forget your lines.

### ❌ 500 words per slide

Your eyes can't scan that fast — same as having no script at all.

## Standard prompt for generating scripts with AI

> "For each slide, write a **150-300 word** verbatim script and place it inside `<aside class="notes">`.
> Requirements:
> 1. Use **spoken** language, not written prose ('so' / 'but' / 'next', not 'therefore' / 'however' / 'in summary').
> 2. Bold the **core keywords** with `<strong>`.
> 3. Put transitions in their own paragraph (1-3 sentences each).
> 4. It should read like talking, not reciting.
> 5. End each slide with a natural transition into the next."

## Recommended pairings

- **Themes**: `tokyo-night` (dark, the default for tech talks), `corporate-clean` (light, for business reports), `dracula` (dark fallback).
- **Fonts**: defaults are Noto Sans SC + JetBrains Mono — no changes needed.
- **Motion**: keep it restrained. `fade-up` / `rise-in` feel the most natural; avoid showy effects like `glitch-in` or `confetti-burst`.
- **Slide count**: 30-minute talk = 8–12 slides; 45-minute = 12–16; 1-hour = 16–22.
