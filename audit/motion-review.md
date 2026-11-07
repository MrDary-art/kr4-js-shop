# Motion review

Reviewed against the project `animate`, `review-animations`, Emil Design Engineering, and Apple Design guidance.

| Component | Trigger / frequency | Implementation | Verdict |
| --- | --- | --- | --- |
| Button and icon press | Frequent | `scale(.97)`, 140 ms, strong ease-out | Pass: tactile, interruptible CSS transition inside the 100–160 ms target. |
| Mobile menu | Occasional | Opacity + transform from top origin, 180 ms ease-out; keyboard mode removes duration | Pass: origin-aware and keyboard-safe. |
| Quick-view dialog | Occasional | Opacity + `scale(.96→1)`, 220 ms ease-out | Pass: modal-centered physical entry and no `scale(0)`. |
| Toast | Occasional | Transform + opacity, 220 ms ease-out | Pass: transition remains interruptible and under 300 ms. |
| Catalogue filtering | Frequent while typing | Search rerenders without grid animation; category/sort changes may use a 240 ms staggered reveal | Pass after fix: typing no longer replays decorative motion on every keystroke. |
| Section and object reveal | Rare marketing exposure | 420–700 ms clip/transform/opacity reveals | Pass: longer timing is confined to first-time explanatory imagery. |
| Product hover | Pointer-only | Image transform, 280 ms; wrapped in hover/fine-pointer media query | Pass: no false touch hover and no layout shift. |
| Reduced motion | User preference | Smooth scrolling and transform motion collapse to near-instant final states | Pass: content and feedback remain understandable. |

No `ease-in`, `transition: all`, `scale(0)`, layout-property animation, or ungated hover motion remains.
