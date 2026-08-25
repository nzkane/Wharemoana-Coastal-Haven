import { Router, type IRouter } from "express";
import {
  CreateStayEnquiryBody,
  CreateStayEnquiryResponse,
} from "@workspace/api-zod";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

router.post("/enquiries", (req, res): void => {
  const parsed = CreateStayEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "Invalid stay enquiry");
    res.status(400).json({ error: "Please check the enquiry details and try again." });
    return;
  }

  const { name, email, checkIn, checkOut, guests, message } = parsed.data;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !Number.isInteger(guests)) {
    res.status(400).json({ error: "Please enter a valid email address and whole number of guests." });
    return;
  }

  if (checkOut <= checkIn) {
    res.status(400).json({ error: "Check-out must be after check-in." });
    return;
  }

  const recipient = "info@housebythesea.co.nz";
  const subject = `Stay enquiry from ${name}`;
  const formattedCheckIn = checkIn.toISOString().slice(0, 10);
  const formattedCheckOut = checkOut.toISOString().slice(0, 10);
  const body = [
    "Hello Wharemoana,",
    "",
    "I would like to enquire about a stay.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Check-in: ${formattedCheckIn}`,
    `Check-out: ${formattedCheckOut}`,
    `Guests: ${guests}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const response = CreateStayEnquiryResponse.parse({
    status: "ready",
    recipient,
    subject,
    body,
  });
  res.json(response);
});

export default router;
