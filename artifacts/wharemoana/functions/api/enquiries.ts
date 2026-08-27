type BookingFunctionEnv = {
  WEBHOOK_URL?: string;
  WEBHOOK_SECRET?: string;
};

type PagesFunctionContext = {
  request: Request;
  env: BookingFunctionEnv;
};

type EnquiryPayload = {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
};

type BookingWebhookPayload = EnquiryPayload & {
  source: "wharemoana-booking-form";
  submittedAt: string;
};

const WEBHOOK_TIMEOUT_MS = 10_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body: Record<string, string>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function getDateOnly(value: unknown): string | null {
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

function getWebhookUrl(value: string | undefined): URL | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function validateEnquiry(body: unknown): EnquiryPayload | null {
  if (!body || typeof body !== "object") return null;

  const values = body as Record<string, unknown>;
  const name = values.name;
  const email = values.email;
  const phone = values.phone;
  const checkIn = getDateOnly(values.checkIn);
  const checkOut = getDateOnly(values.checkOut);
  const guests = values.guests;
  const message = values.message;

  if (
    typeof name !== "string" ||
    name.length < 1 ||
    name.length > 100 ||
    typeof email !== "string" ||
    email.length > 254 ||
    !EMAIL_PATTERN.test(email) ||
    typeof phone !== "string" ||
    phone.length < 1 ||
    phone.length > 30 ||
    !checkIn ||
    !checkOut ||
    checkOut <= checkIn ||
    typeof guests !== "number" ||
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 20 ||
    typeof message !== "string" ||
    message.length < 1 ||
    message.length > 2_000
  ) {
    return null;
  }

  return {
    name,
    email,
    phone,
    checkIn,
    checkOut,
    guests,
    message,
  };
}

export const onRequestPost = async ({
  request,
  env,
}: PagesFunctionContext): Promise<Response> => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { error: "Please check the enquiry details and try again." },
      400,
    );
  }

  const enquiry = validateEnquiry(body);
  if (!enquiry) {
    return jsonResponse(
      { error: "Please check the enquiry details and try again." },
      400,
    );
  }

  const webhookUrl = getWebhookUrl(env.WEBHOOK_URL);
  if (!webhookUrl) {
    return jsonResponse(
      {
        error:
          "Booking enquiries are temporarily unavailable. Please try again later.",
      },
      503,
    );
  }

  const webhookPayload: BookingWebhookPayload = {
    source: "wharemoana-booking-form",
    submittedAt: new Date().toISOString(),
    ...enquiry,
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  const secret = env.WEBHOOK_SECRET?.trim();

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-Booking-Webhook-Secret": secret } : {}),
      },
      body: JSON.stringify(webhookPayload),
      signal: controller.signal,
    });

    if (!webhookResponse.ok) {
      return jsonResponse(
        { error: "We could not send your enquiry. Please try again later." },
        502,
      );
    }
  } catch {
    return jsonResponse(
      { error: "We could not send your enquiry. Please try again later." },
      502,
    );
  } finally {
    clearTimeout(timeout);
  }

  return jsonResponse({ status: "submitted" }, 200);
};