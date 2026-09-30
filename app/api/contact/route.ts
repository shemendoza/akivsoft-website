import nodemailer from "nodemailer";

export const runtime = "nodejs";

const recipient = "akivsoft@gmail.com";
const allowedServices = new Set([
  "Game Development",
  "Game Concept & Design",
  "2D & 3D Game Development",
  "Multiplayer & Online Games",
  "Mobile Game Development",
  "PC & Console Game Development",
  "Game Art & Animation",
  "Sound & Game Audio",
  "Optimization & Testing",
  "Launch & Support",
  "Other",
]);

function getText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12_000) {
    return Response.json({ error: "The message is too large." }, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ error: "Invalid form submission." }, { status: 400 });
    }
    payload = body as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  // Silently accept automated honeypot submissions without sending mail.
  if (getText(payload.website, 200)) {
    return Response.json({ ok: true });
  }

  const name = getText(payload.name, 100);
  const email = getText(payload.email, 254);
  const service = getText(payload.service, 100);
  const message = getText(payload.message, 4_000);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validationError = !name
    ? "Please enter your name."
    : !validEmail
      ? "Please enter a complete email address, such as name@example.com."
      : !allowedServices.has(service)
        ? "Please choose a service."
        : !message
          ? "Please enter a message."
          : null;

  if (validationError) {
    return Response.json(
      { error: validationError },
      { status: 400 },
    );
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");

  if (!gmailUser || !gmailAppPassword) {
    return Response.json(
      { error: "Email delivery isn't configured on this site yet." },
      { status: 503 },
    );
  }

  const safeName = name.replace(/[\r\n]+/g, " ").slice(0, 100);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  try {
    await transporter.sendMail({
      from: { name: "Akivsoft Website", address: gmailUser },
      to: recipient,
      replyTo: { name: safeName, address: email },
      subject: `New game project inquiry from ${safeName}`,
      text: [
        "New project inquiry from the Akivsoft website",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Service: ${service}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Contact email delivery failed.", error);
    return Response.json(
      { error: "We couldn't send your message right now." },
      { status: 502 },
    );
  }
}
