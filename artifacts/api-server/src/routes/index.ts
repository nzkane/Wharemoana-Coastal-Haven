import { Router, type IRouter } from "express";
import {
  CreateStayEnquiryBody,
  CreateStayEnquiryResponse,
} from "@workspace/api-zod";
import healthRouter from "./health";

const router: IRouter = Router();
const BOOKING_WEBHOOK_URL_ENV = "N8N_BOOKING_WEBHOOK_URL";
const BOOKING_WEBHOOK_SECRET_ENV = "N8N_BOOKING_WEBHOOK_SECRET";
const BOOKING_WEBHOOK_TIMEOUT_MS = 10_000;

type BookingWebhookPayload = {
  source: "wharemoana-booking-form";
  submittedAt: string;
  name: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
};

function getBookingWebhookUrl(rawUrl: string | undefined): URL | null {
  if (!rawUrl?.trim()) return null;

  try {
    const url = new URL(rawUrl.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function getStrictDateOnly(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearString, monthString, dayString] = match;
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return value;
}

router.use(healthRouter);

router.post("/enquiries", async (req, res): Promise<void> => {
  const parsed = CreateStayEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "Invalid stay enquiry");
    res.status(400).json({ error: "Please check the enquiry details and try again." });
    return;
  }

  const { name, email, guests, message } = parsed.data;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !Number.isInteger(guests)) {
    res.status(400).json({ error: "Please enter a valid email address and whole number of guests." });
    return;
  }

  const checkIn = getStrictDateOnly(req.body?.checkIn);
  const checkOut = getStrictDateOnly(req.body?.checkOut);
  if (!checkIn || !checkOut) {
    res.status(400).json({
      error: "Please enter valid arrival and departure dates.",
    });
    return;
  }

  if (checkOut <= checkIn) {
    res.status(400).json({ error: "Check-out must be after check-in." });
    return;
  }

  const configuredUrl = process.env[BOOKING_WEBHOOK_URL_ENV];
  const webhookUrl = getBookingWebhookUrl(configuredUrl);
  if (!webhookUrl) {
    req.log.error(
      { configured: Boolean(configuredUrl?.trim()) },
      "Booking webhook is not configured",
    );
    res.status(503).json({
      error: "Booking enquiries are temporarily unavailable. Please try again later.",
    });
    return;
  }

  const payload: BookingWebhookPayload = {
    source: "wharemoana-booking-form",
    submittedAt: new Date().toISOString(),
    name,
    email,
    checkIn,
    checkOut,
    guests,
    message,
  };
  const secret = process.env[BOOKING_WEBHOOK_SECRET_ENV]?.trim();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BOOKING_WEBHOOK_TIMEOUT_MS);

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-Booking-Webhook-Secret": secret } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!webhookResponse.ok) {
      req.log.error(
        { statusCode: webhookResponse.status },
        "Booking webhook rejected enquiry",
      );
      res.status(502).json({
        error: "We could not send your enquiry. Please try again later.",
      });
      return;
    }
  } catch (error) {
    req.log.error(
      {
        errorName: error instanceof Error ? error.name : "UnknownError",
        timedOut: error instanceof Error && error.name === "AbortError",
      },
      "Booking webhook request failed",
    );
    res.status(502).json({
      error: "We could not send your enquiry. Please try again later.",
    });
    return;
  } finally {
    clearTimeout(timeout);
  }

  const response = CreateStayEnquiryResponse.parse({ status: "submitted" });
  res.json(response);
});

export default router;
