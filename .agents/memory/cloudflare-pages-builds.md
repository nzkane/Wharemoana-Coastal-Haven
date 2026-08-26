---
name: Cloudflare Pages builds
description: Build and environment constraints when deploying Wharemoana to Cloudflare Pages.
---

Cloudflare Pages runs the Vite production build without Replit workflow
variables. The static build must therefore default safely when `PORT` and
`BASE_PATH` are absent; the booking webhook belongs in a Pages Function runtime
environment, not in Vite-exposed configuration.

**Why:** Requiring Replit's workflow variables during Vite configuration made a
normal Cloudflare Pages build fail before static assets were created.

**How to apply:** Keep production Vite defaults portable, configure
`WEBHOOK_URL` (and optional `WEBHOOK_SECRET`) as Cloudflare Pages secrets, and
keep the browser limited to the same-origin `/api/enquiries` path.