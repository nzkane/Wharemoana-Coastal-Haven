---
name: Portrait hero framing
description: Responsive visual treatment for Wharemoana's portrait beach-facing hero photo.
---

Desktop always uses a full-bleed `object-fit: cover` crop for the hero photo, at every desktop aspect ratio including short/wide windows. Mobile/narrow framing is unchanged.

**Why:** An earlier version used `object-fit: contain` with a neutral color-field fill on short, wide desktop windows, to avoid losing parts of the portrait photo (sky/house/shoreline/water can't all fit in an undistorted wide crop). The user explicitly asked (2026-08-27) to reverse that and always fill the screen edge-to-edge on desktop instead, accepting that very wide/short windows crop out some scene elements.

**How to apply:** Do not reintroduce `object-fit: contain` or a neutral-fill background for desktop breakpoints unless the user asks again. Adjust `object-position` per aspect-ratio breakpoint if the crop loses key subject matter, but keep `object-fit: cover` throughout desktop.
