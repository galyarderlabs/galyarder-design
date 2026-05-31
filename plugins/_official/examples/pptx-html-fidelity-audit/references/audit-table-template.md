# Audit Table Template

Drop-in markdown template for the Step-3 audit deliverable. Keep the column order and severity legend stable across audits — readers learn to scan for 🔴 first.

## Template

```markdown
**Fidelity audit · `<deck-name>` · <date>**

| Slide | Issue | Severity |
|---|---|---|
| 1 cover     | meta row hits 6.95" and crosses the 6.7" footer rail | 🔴 |
| 2 principle | meta row overlaps the footer                           | 🔴 |
| 5 checklist | row-B step description bottoms out at 7.2" and clips into the footer | 🔴 |
| 8 3E        | closing paragraph sits right on the footer's starting line | 🔴 |
| 9 on-day    | step description bottom touches the footer with no safety margin | 🟠 |
| 10 obs      | row-2 obs-card bottoms at 6.95" and clips the footer    | 🔴 |
| 11 P&D      | the Note paragraph bottoms at 7.34", fully past the footer rail | 🔴 |
| 13 deliv.   | pipeline description bottoms at 7.05" and clips the footer | 🔴 |
| 14 closing  | meta row bottoms at 7.24", well past the footer rail   | 🔴 |
| multiple    | em (Playfair italic) and special-size contrast not preserved | 🟡 |

**Root causes**

1. **No footer rail enforced.** Content blocks pinned at hand-picked y-coordinates; the script had no `CONTENT_MAX_Y` invariant, so `top + height` silently crossed `6.7"` whenever the content was taller than the test slide.
2. **Hero slides anchored at `MARGIN_TOP`.** Vertical centering was done by eye; cover and chapter-intro slides drift down as block heights vary.
3. **Italic propagation skipped.** `<em>` spans in HTML mapped to plain runs; the EN serif italic identity was lost across all hero slides.

**Fix plan**

- Introduce `CONTENT_MAX_Y = 6.70"` and `FOOTER_TOP = 6.85"` as module-level constants.
- Route all content blocks through a `Cursor` that refuses to cross the rail.
- Switch hero slides to `hero_layout(blocks)` — compute total stack height, center on canvas.
- Tighten `desc_h` (pipeline `0.85"`, checklist `0.65"`) to fit text + 0.05" pad.
- Add `italic=True` path in `add_run()` that swaps to EN serif for italic Latin runs; skip italic for CJK.
- Add post-export `verify_layout.py` step; require zero rail violations.
```

## Severity legend (reproduce inline in reports)

```markdown
- 🔴 **critical** — content cropped, text invisible, footer overlap, off-canvas. Must fix.
- 🟠 **high** — content visible but visual hierarchy broken, no breathing room. Should fix.
- 🟡 **medium** — italic/em missing, font fallback wrong, color drift. Fix in this pass.
- 🟢 **low** — minor spacing/alignment, sub-pixel offsets. Note but don't block.
```

## Verification footer (append after re-export)

```markdown
**Verification**

- ✅ 0 rail violations across 14 slides
- ✅ All shapes within canvas (`top + height ≤ 7.5"`, `left + width ≤ 13.333"`)
- ✅ Italic preserved on all `<em>` runs (EN serif), skipped on CJK runs
- ✅ Hero slides centered (cover, 03 act-i, 06 act-ii, 11 act-iii, 13 closing)
- File: `<absolute-path>.pptx` · 54.7 KB
```
