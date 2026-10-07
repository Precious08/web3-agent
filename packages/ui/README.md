# @web3-agent/ui — Phase 1 foundation

Stack: Tailwind + shadcn/ui + Radix (your pick: my recommendation).
Theme: dark-first default (`:root` = dark), light via `data-theme="light"` on `<html>` — toggle in app header.
Palette: semantic, colorblind-safe — Strong green / Emerging blue / Uncertain amber / Noise gray.
Preview: `apps/web/app/design/page.tsx` (`/design` route, no backend, mocked PRD Sec 13.3/16/21 examples).
Next rub-heads iteration: real shadcn wiring + a11y (focus, contrast, keyboard) per component.
