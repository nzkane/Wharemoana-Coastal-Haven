# n8n Booking Webhook

The public booking form submits to the site's same-origin `POST /api/enquiries`
endpoint. In the Cloudflare deployment, the Pages Function at
`functions/api/enquiries.ts` validates the enquiry and forwards it server-side
to n8n. The n8n URL is never sent to the browser.

## Secrets

For Cloudflare Pages, configure these encrypted environment variables in the
Pages project. The names are also documented in
`artifacts/wharemoana/.env.example`:

- `WEBHOOK_URL` — the n8n production webhook URL
- `WEBHOOK_SECRET` — optional shared secret sent as
  `X-Booking-Webhook-Secret`

Use the production webhook URL for the live site and keep a separate n8n test
webhook for development. `WEBHOOK_URL` must use HTTPS so guest details and the
optional shared secret are encrypted in transit. Do not put either value in
frontend code or commit them to the repository.

The separate Replit API keeps its existing `N8N_BOOKING_WEBHOOK_URL` and
`N8N_BOOKING_WEBHOOK_SECRET` names only for the current Replit preview. The
Cloudflare Pages Function does not read those Replit variables.

## JSON payload

The API sends this shape to n8n:

```json
{
  "source": "wharemoana-booking-form",
  "submittedAt": "2026-08-26T04:00:00.000Z",
  "name": "Guest name",
  "email": "guest@example.com",
  "checkIn": "2026-12-01",
  "checkOut": "2026-12-07",
  "guests": 2,
  "message": "Booking notes"
}
```

n8n should use the payload to format and send Baden's email. The app returns a
success response only after n8n responds with a 2xx status. Missing
configuration, timeouts, and upstream failures return a safe error to the
guest without exposing webhook details.

Arrival and departure values are accepted only as real `YYYY-MM-DD` calendar
dates, so n8n receives the same date strings the guest entered. The API
documents validation errors as `400`, n8n communication failures as `502`, and
missing webhook configuration as `503`; each returns `{ "error": "..." }`.

## Cloudflare path

Cloudflare Pages maps `functions/api/enquiries.ts` to `/api/enquiries`
automatically. The generated browser client already targets that local path,
so no absolute API or webhook URL is required in the frontend. Cloudflare
dashboard variables provide the runtime values; `.env.example` is
documentation only.

## Cloudflare Pages build settings

Set the Cloudflare Pages project root to `artifacts/wharemoana`, then use:

- Build command: `pnpm run build`
- Build output directory: `dist/public`

If the Pages project must use the repository root instead, use
`pnpm --filter @workspace/wharemoana run build` and set the output directory
to `artifacts/wharemoana/dist/public`. The production build defaults to `/`
for its Vite base path and does not require Replit's `PORT` or `BASE_PATH`
variables.