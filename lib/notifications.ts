import nodemailer from "nodemailer";
import type { Booking, ContactMessage } from "./types";

type MailOptions = {
  subject: string;
  text: string;
  to?: string;
};

function notificationFrom() {
  return process.env.NOTIFICATION_FROM || process.env.SMTP_USER;
}

function adminEmail() {
  return process.env.ADMIN_NOTIFY_EMAIL || notificationFrom();
}

function smsEnabled() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER,
  );
}

function mailEnabled() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendEmail({ subject, text, to }: MailOptions) {
  const recipient = to || adminEmail();
  const from = notificationFrom();

  if (!mailEnabled() || !recipient || !from) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from,
    to: recipient,
    subject,
    text,
  });
}

async function sendSms(to: string | undefined, message: string) {
  if (!to || !smsEnabled()) return;

  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const body = new URLSearchParams({
    To: to,
    From: process.env.TWILIO_FROM_NUMBER!,
    Body: message,
  });

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
}

async function notify(task: () => Promise<void>) {
  try {
    await task();
  } catch (error) {
    console.error("Notification failed", error);
  }
}

export async function notifyBookingCreated(booking: Booking) {
  await notify(async () => {
    const text = [
      `New booking ${booking.trackingNumber}`,
      `Route: ${booking.pickup} to ${booking.destination}`,
      `Service: ${booking.service}`,
      `Fee: GHC ${booking.amount}`,
      `Sender: ${booking.senderPhone}`,
      `Receiver: ${booking.receiverPhone}`,
    ].join("\n");

    await sendEmail({
      subject: `New delivery booking: ${booking.trackingNumber}`,
      text,
    });
    await sendSms(
      booking.senderPhone,
      `GDS booking received. Tracking: ${booking.trackingNumber}. Fee: GHC ${booking.amount}.`,
    );
  });
}

export async function notifyBookingStatusChanged(booking: Booking) {
  await notify(async () => {
    const status = booking.status.replace("_", " ");
    const text = [
      `Booking ${booking.trackingNumber} is now ${status}`,
      `Route: ${booking.pickup} to ${booking.destination}`,
      `Latest update: ${booking.timeline.at(-1)?.description || status}`,
    ].join("\n");

    await sendEmail({
      subject: `Shipment update: ${booking.trackingNumber}`,
      text,
    });
    await sendSms(booking.senderPhone, `GDS update: ${booking.trackingNumber} is now ${status}.`);
    await sendSms(booking.receiverPhone, `GDS update: ${booking.trackingNumber} is now ${status}.`);
  });
}

export async function notifyContactMessage(message: ContactMessage) {
  await notify(async () => {
    await sendEmail({
      subject: `Contact message: ${message.subject}`,
      text: [
        `From: ${message.name}`,
        `Email: ${message.email}`,
        `Phone: ${message.phone}`,
        "",
        message.message,
      ].join("\n"),
    });
  });
}
