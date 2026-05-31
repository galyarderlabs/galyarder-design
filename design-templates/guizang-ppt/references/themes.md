# Theme presets

Five carefully tuned color palettes that protect the "editorial magazine × electronic ink" aesthetic. **Custom user colors are not allowed — bad palettes wreck the whole look instantly.** Pick one of the five below.

---

## How to use

1. Ask the user which set to pick (or recommend one based on the content).
2. Open the `<style>` block at the top of `assets/template.html`.
3. Find the opening `:root{` block.
4. **Replace the whole "theme color" section** — the lines for `--ink` / `--ink-rgb` / `--paper` / `--paper-rgb` / `--paper-tint` / `--ink-tint`.
5. Every other CSS rule reads from `var(--...)`, so no further edits are required.

---

## 🖋 Ink Classic (Monocle default)

**Best for**: general-purpose talks, business launches, tech products — the safe default for any scenario.
**Tone**: pure ink black + warm cream. Strongest magazine feel; *Monocle* / *Apricot* / A Book Apart territory.

```css
--ink:#0a0a0b;
--ink-rgb:10,10,11;
--paper:#f1efea;
--paper-rgb:241,239,234;
--paper-tint:#e8e5de;
--ink-tint:#18181a;
```

---

## 🌊 Indigo Porcelain

**Best for**: tech / research / data-heavy talks, engineering culture, deep-dive content, technical launches.
**Tone**: deep indigo + porcelain white. Calm, rational, weighty — like an academic journal or blue-and-white china.

```css
--ink:#0a1f3d;
--ink-rgb:10,31,61;
--paper:#f1f3f5;
--paper-rgb:241,243,245;
--paper-tint:#e4e8ec;
--ink-tint:#152a4a;
```

---

## 🌿 Forest Ink

**Best for**: nature / sustainability / culture / nonfiction, outdoor brands, environmental themes.
**Tone**: deep forest green + ivory. Grounded with breathing room — old-school *National Geographic*.

```css
--ink:#1a2e1f;
--ink-rgb:26,46,31;
--paper:#f5f1e8;
--paper-rgb:245,241,232;
--paper-tint:#ece7da;
--ink-tint:#253d2c;
```

---

## 🍂 Kraft Paper

**Best for**: nostalgia / humanities / reading / history / literary talks, indie magazines, handmade brands.
**Tone**: deep brown + warm cream. Like a kraft envelope or a vintage notebook — warm and time-worn.

```css
--ink:#2a1e13;
--ink-rgb:42,30,19;
--paper:#eedfc7;
--paper-rgb:238,223,199;
--paper-tint:#e0d0b6;
--ink-tint:#3a2a1d;
```

---

## 🌙 Dune

**Best for**: art / design / creative / fashion talks, gallery booklets, taste-driven private sessions.
**Tone**: charcoal + sand. Restrained, refined, neutral — desert dusk or an architectural portfolio.

```css
--ink:#1f1a14;
--ink-rgb:31,26,20;
--paper:#f0e6d2;
--paper-rgb:240,230,210;
--paper-tint:#e3d7bf;
--ink-tint:#2d2620;
```

---

## Recommendation cheat sheet

| If your topic is... | Pick |
|---|---|
| Unsure / first time using this | 🖋 Ink Classic |
| AI / tech / product launch | 🌊 Indigo Porcelain |
| Content / industry observation / culture | 🌿 Forest Ink |
| Book reviews / lifestyle / humanities | 🍂 Kraft Paper |
| Design / art / branding | 🌙 Dune |

---

## Switching rules

- **One deck, one theme** — never swap mid-deck.
- The default WebGL shader main colors (titanium dispersion / silver flow) work with all five sets (tested and acceptable).
- `currentColor`-driven borders and icons follow the section's text color automatically — no extra tuning needed.
- After picking a theme, the `<title>` text and the `chrome` copy can lean into the theme's tone (e.g. Kraft Paper paired with "Vol.03 · Autumn").

## ❌ Don't

- ❌ **No mixing** (e.g. ink from Ink Classic with paper from Dune) — it breaks instantly.
- ❌ **No arbitrary hex values from the user** — politely decline and present the five presets to choose from.
- ❌ **Don't edit colors elsewhere in template.html directly** — every scattered rgba reads from a var; a single change to `:root` is enough.

After picking a theme, mention it in the skill conversation ("using 🖋 Ink Classic / 🌊 Indigo Porcelain ...") and note it in the project record so future iterations stay consistent.
