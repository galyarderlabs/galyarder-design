# Theme Color Presets

Five hand-tuned palettes that hold the "editorial × e-ink" aesthetic together. **Custom colors are not allowed — a wrong palette breaks the look instantly**, so always pick from the presets below.

---

## How to apply

1. Ask the user which palette to use (or recommend one based on the topic).
2. Open the `<style>` block in `assets/template.html`.
3. Find the `:root{` block at the top.
4. **Replace the lines marked "theme color"** wholesale: `--ink` / `--ink-rgb` / `--paper` / `--paper-rgb` / `--paper-tint` / `--ink-tint`.
5. Everything else uses `var(--...)`, so no other edits are needed.

---

## Ink Classic (Monocle default)

**Best for**: general talks, product launches, tech announcements — the safe default for any scenario.
**Mood**: pure ink black + warm off-white. The most editorial of the set, channeling Monocle / Apricot / A Book Apart.

```css
--ink:#0a0a0b;
--ink-rgb:10,10,11;
--paper:#f1efea;
--paper-rgb:241,239,234;
--paper-tint:#e8e5de;
--ink-tint:#18181a;
```

---

## Indigo Porcelain

**Best for**: research, data, engineering culture, deep technical content, tech launches.
**Mood**: deep indigo + porcelain white. Cool, rational, with depth — like an academic journal or blue-and-white porcelain.

```css
--ink:#0a1f3d;
--ink-rgb:10,31,61;
--paper:#f1f3f5;
--paper-rgb:241,243,245;
--paper-tint:#e4e8ec;
--ink-tint:#152a4a;
```

---

## Forest Ink

**Best for**: nature, sustainability, culture, non-fiction; outdoor brands; environmental topics.
**Mood**: deep forest green + ivory. Grounded and breathable, reminiscent of vintage National Geographic.

```css
--ink:#1a2e1f;
--ink-rgb:26,46,31;
--paper:#f5f1e8;
--paper-rgb:245,241,232;
--paper-tint:#ece7da;
--ink-tint:#253d2c;
```

---

## Kraft Paper

**Best for**: nostalgia, humanities, reading, history, literary talks; indie magazines; handmade brands.
**Mood**: deep brown + warm beige. Like a kraft envelope or an old notebook — warm and timeworn.

```css
--ink:#2a1e13;
--ink-rgb:42,30,19;
--paper:#eedfc7;
--paper-rgb:238,223,199;
--paper-tint:#e0d0b6;
--ink-tint:#3a2a1d;
```

---

## Dune

**Best for**: art, design, creative direction, fashion; gallery booklets; aesthetics-first private talks.
**Mood**: charcoal + sand. Restrained, refined, neutral — like dusk in the desert or an architectural portfolio.

```css
--ink:#1f1a14;
--ink-rgb:31,26,20;
--paper:#f0e6d2;
--paper-rgb:240,230,210;
--paper-tint:#e3d7bf;
--ink-tint:#2d2620;
```

---

## Quick recommendation

| If the talk is... | Theme |
|---|---|
| Unsure / first time using | Ink Classic |
| AI / tech / product launch | Indigo Porcelain |
| Content / industry observation / culture | Forest Ink |
| Book talk / lifestyle / humanities | Kraft Paper |
| Design / art / brand | Dune |

---

## Switching rules

- **One theme per deck** — never swap colors mid-deck.
- The default WebGL shaders (titanium dispersion / silver flow) work with all five palettes (verified).
- `currentColor`-driven borders and icons inherit each section's text color automatically; no extra tuning needed.
- Once the theme is chosen, you can reinforce it through `<title>` text and `chrome` copy (e.g., Kraft Paper paired with "Vol.03 · Autumn").

## Don't

- Don't mix and match (e.g., `ink` from Ink Classic with `paper` from Dune) — the result is jarring.
- Don't accept arbitrary hex values from users — politely decline and present the five presets.
- Don't edit colors elsewhere in template.html — every scattered `rgba` already reads from a `var`, so changing `:root` once is enough.

After picking a theme, tell the user: "Using Ink Classic / Indigo Porcelain / ..." and note it in the deck's project log so future iterations stay consistent.
