# Themes catalog

Every theme is a short CSS file in `assets/themes/` that overrides tokens
defined in `assets/base.css`. Switch themes by changing the `href` of
`<link id="theme-link">` or by pressing **T** if the deck has a
`data-themes="a,b,c"` attribute on `<body>` or `<html>`.

All themes define the same variables: `--bg`, `--bg-soft`, `--surface`,
`--surface-2`, `--border`, `--text-1/2/3`, `--accent`, `--accent-2/3`,
`--good`, `--warn`, `--bad`, `--grad`, `--grad-soft`, `--radius*`, `--shadow*`,
`--font-sans`, `--font-display`.

## Light & calm

| name | description | when to use |
|---|---|---|
| `minimal-white` | Minimal white, restrained and high-end. Inter, strong type hierarchy, very low shadow. | Internal reviews, 1:1 technical reviews, serious topics that shouldn't fight the content |
| `editorial-serif` | Magazine-style Playfair serif on a cream base. | Brand storytelling, long text-heavy talks |
| `soft-pastel` | Soft three-color macaron gradient. | Product launches, consumer-facing topics, lighter material |
| `xiaohongshu-white` | RedNote (xhs) white background + warm-red accent + serif headlines. | RedNote image posts, lifestyle / aesthetic content |
| `solarized-light` | Classic low-glare palette. | Long-form workshops and teaching |
| `catppuccin-latte` | Catppuccin light. | Developer-friendly, geek-leaning tech sharing |

## Bold & statement

| name | description | when to use |
|---|---|---|
| `sharp-mono` | Pure black-and-white + Archivo Black + hard shadows. | Manifesto-style, maximum visual impact |
| `neo-brutalism` | Thick borders, hard shadows, bright yellow accent. | Startup pitches, "say it loud" voice |
| `bauhaus` | Geometric + red-yellow-blue primaries. | Design talks, art-history / product-aesthetic topics |
| `swiss-grid` | Swiss grid + Helvetica feel + 12-column underlay. | Serious typography, the design industry |
| `memphis-pop` | Memphis pop dots in the background + display headlines. | Young, trendy, brand collabs |

## Cool & dark

| name | description | when to use |
|---|---|---|
| `catppuccin-mocha` | Catppuccin dark. | Internal dev sharing, long viewing sessions |
| `dracula` | Classic Dracula purple-red. | Code-dense tech sharing |
| `tokyo-night` | Tokyo Night blue-night. | Cooler tech sharing, infrastructure |
| `nord` | Nordic cool blue and white. | Infrastructure, cloud products |
| `gruvbox-dark` | Warm retro dark. | Terminal / vim / *nix communities |
| `rose-pine` | Rose Pine, soft dark. | Design ↔ engineering crossover, taste-driven tech |
| `arctic-cool` | Blue / cyan / slate-grey light variant. | Business analytics, finance, calm and rational |

## Warm & vibrant

| name | description | when to use |
|---|---|---|
| `sunset-warm` | Orange / coral / amber three-color gradient. | Lifestyle, awards, positive emotional tone |

## Effect-heavy

| name | description | when to use |
|---|---|---|
| `glassmorphism` | Frosted glass + multi-color light spots in the background. | Apple-style launches, product feature reveals |
| `aurora` | Aurora gradient + blur + saturate. | Cover / CTA / closer pages |
| `rainbow-gradient` | White base + flowing rainbow gradient accent. | Joyful, festive, celebration pages |
| `blueprint` | Engineering blueprint + grid underlay + montage type. | System architecture, engineering blueprints |
| `terminal-green` | Green-screen terminal + monospace + glowing text. | CLI / black-hat / retro punk |

## v2 additions

### Light & professional

| name | description | when to use |
|---|---|---|
| `corporate-clean` | Pure white + navy accent + Inter + conservative borders. | Board reports, B2B sales, finance and insurance |
| `pitch-deck-vc` | YC-style white base + blue-purple gradient accent + generous whitespace. | Fundraising pitches, seed round, VC meeting |
| `academic-paper` | Paper white + serif body + black ink + blue links. | Academic reports, research sharing, conference papers |
| `japanese-minimal` | Ivory white + vermillion accent + huge whitespace + Noto Serif. | Brand refreshes, craftsmanship stories, zen narrative |
| `engineering-whiteprint` | White base + grid paper + navy ink lines + monospace. | System design, API docs, architecture white paper |

### Bold & editorial

| name | description | when to use |
|---|---|---|
| `magazine-bold` | Cream base + huge Playfair serif + orange spot. | Long-form columns, cover stories, brand monthly |
| `news-broadcast` | White base + red vertical bar + Oswald all-caps + hard shadow. | Breaking news, launch press release, data broadcast |
| `midcentury` | Cream base + mustard / teal / burnt orange + sharp geometry. | Design history, home aesthetics, retro brands |
| `retro-tv` | Warm cream + CRT scanlines + amber-orange accent. | Nostalgia narratives, '80s/'90s themes |

### Effect-heavy / dramatic

| name | description | when to use |
|---|---|---|
| `cyberpunk-neon` | Pure black + neon pink/cyan/yellow + glow + JetBrains Mono. | Hacker, underground culture, cyber talks |
| `vaporwave` | Deep purple + pink-cyan-blue gradients + bloom light spots. | Music, trend art, A E S T H E T I C |
| `y2k-chrome` | Silver chrome gradient + rainbow accent + big radius + Space Grotesk. | Millennial nostalgia, fashion brands, Gen-Z |

## How to apply

```html
<link rel="stylesheet" id="theme-link" href="../assets/themes/aurora.css">
```

Or enable `T`-cycling by listing themes on the body:

```html
<body data-themes="minimal-white,aurora,catppuccin-mocha" data-theme-base="../assets/themes/">
```

## How to extend

Copy an existing theme, rename it, and override only the variables you want to
change. Keep each theme under ~200 lines. Prefer adjusting tokens to adding
new selectors.
