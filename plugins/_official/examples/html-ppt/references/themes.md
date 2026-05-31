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
| `minimal-white` | Minimalist white, restrained and refined. Inter, strong type hierarchy, minimal shadows. | Internal reviews, 1:1 technical reviews, serious topics where the slides shouldn't fight the content. |
| `editorial-serif` | Magazine-style Playfair serif on a cream base. | Brand storytelling, copy-heavy long-form talks. |
| `soft-pastel` | Gentle three-color macaron gradient. | Product launches, consumer-facing pitches, light topics. |
| `xiaohongshu-white` | RedNote white background plus a warm-red accent and serif headline. | RedNote image-text posts, lifestyle and aesthetics content. |
| `solarized-light` | Classic low-glare palette. | Long-form workshops and teaching sessions. |
| `catppuccin-latte` | Catppuccin light. | Developer-leaning and geek-friendly tech talks. |

## Bold & statement

| name | description | when to use |
|---|---|---|
| `sharp-mono` | Pure black-and-white plus Archivo Black and hard shadows. | Manifesto-style decks with maximum visual impact. |
| `neo-brutalism` | Heavy outlines, hard shadows, bright-yellow accent. | Startup roadshows; bold, no-apologies tone. |
| `bauhaus` | Geometry plus red/yellow/blue primaries. | Design talks, art-history or product-aesthetics topics. |
| `swiss-grid` | Swiss grid feel + Helvetica vibe + 12-column underlay. | Serious typography, design industry. |
| `memphis-pop` | Memphis-pop background dots + oversized headlines. | Young, trend-led, brand collaborations. |

## Cool & dark

| name | description | when to use |
|---|---|---|
| `catppuccin-mocha` | Catppuccin dark. | Internal developer shares, long viewing sessions. |
| `dracula` | Classic Dracula purple-red. | Code-heavy tech talks. |
| `tokyo-night` | Tokyo Night blue-night. | Cool-leaning tech talks, infrastructure. |
| `nord` | Nordic crisp blue and white. | Infrastructure, cloud products. |
| `gruvbox-dark` | Warm retro dark. | Terminal / vim / *nix communities. |
| `rose-pine` | Rosé Pine, soft dark mode. | The design-and-development overlap; aesthetics-leaning tech. |
| `arctic-cool` | Blue / cyan / slate-grey light variant. | Business analytics, finance, calm and rational tone. |

## Warm & vibrant

| name | description | when to use |
|---|---|---|
| `sunset-warm` | Orange / coral / amber three-color gradient. | Lifestyle, awards, upbeat emotional tone. |

## Effect-heavy

| name | description | when to use |
|---|---|---|
| `glassmorphism` | Frosted glass + multi-color light bokeh background. | Apple-style launches, product feature reveals. |
| `aurora` | Aurora gradient + blur + saturation. | Cover / CTA / closing pages. |
| `rainbow-gradient` | White base + flowing rainbow accent gradient. | Joyful, holiday, celebration pages. |
| `blueprint` | Blueprint engineering + grid underlay + montage typography. | System architecture, engineering blueprints. |
| `terminal-green` | Green-screen terminal + monospace + glowing text. | CLI / black-hat / retro punk. |

## v2 additions

### Light & professional

| name | description | when to use |
|---|---|---|
| `corporate-clean` | Pure white + navy accent + Inter + conservative borders. | Board reports, B2B sales, finance and insurance. |
| `pitch-deck-vc` | YC-style white background + blue-purple accent gradient + generous whitespace. | Fundraising decks, seed rounds, VC meetings. |
| `academic-paper` | Paper white + serif body + black ink + blue links. | Academic talks, research shares, conference papers. |
| `japanese-minimal` | Ivory white + vermilion accent + extreme whitespace + Noto Serif. | Brand refreshes, craft-driven stories, zen-like narratives. |
| `engineering-whiteprint` | White base + graph-paper grid + navy ink lines + monospace type. | System design, API docs, architecture white papers. |

### Bold & editorial

| name | description | when to use |
|---|---|---|
| `magazine-bold` | Cream base + oversized Playfair serif + orange spot color. | Column features, cover stories, brand monthlies. |
| `news-broadcast` | White base + red vertical bar + Oswald uppercase + hard shadows. | Breaking news, launch press releases, data broadcasts. |
| `midcentury` | Cream base + mustard / teal / burnt-orange + sharp geometry. | Design history, home aesthetics, retro brands. |
| `retro-tv` | Warm cream + CRT scanlines + amber-orange accent. | Nostalgic narratives, 80s/90s themes. |

### Effect-heavy / dramatic

| name | description | when to use |
|---|---|---|
| `cyberpunk-neon` | Pure black + neon pink/cyan/yellow + glow + JetBrains Mono. | Hackers, underground culture, cyber talks. |
| `vaporwave` | Deep purple + pink/cyan/blue gradient + soft halated bokeh. | Music, trend art, A E S T H E T I C. |
| `y2k-chrome` | Silver chrome gradient + rainbow accent + big radii + Space Grotesk. | Y2K nostalgia, fashion brands, Gen-Z. |

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
