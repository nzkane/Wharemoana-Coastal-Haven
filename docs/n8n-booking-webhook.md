# n8n Booking Webhook

The public booking form submits to the app's same-origin `POST /api/enquiries`
endpoint. The API validates the enquiry and forwards it server-side to n8n.
The n8n URL is never sent to the browser.

## Secrets

Configure these server-side secrets in each environment that runs the API:

- `N8N_BOOKING_WEBHOOK_URL` — the n8n production webhook URL
- `N8N_BOOKING_WEBHOOK_SECRET` — optional shared secret sent as
  `X-Booking-Webhook-Secret`

Use the production webhook URL for the live site and keep a separate n8n test
webhook for development. Do not put either value in frontend code or commit
them to the repository.

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

When the site moves to Cloudflare Pages, keep the same `/api/enquiries`
boundary by hosting the forwarding handler in a Cloudflare Worker or Pages
Function. Reuse the payload and secret names above so the browser and n8n
workflow do not need to change.