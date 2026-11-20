
const encoder = new TextEncoder();

export const AKIV_BASE_COOKIE_NAME = "akiv_base_access";
export const AKIV_BASE_SESSION_DURATION = 60 * 60 * 12;

function getSessionSecret(): string | null {
  const secret = process.env.AKIV_BASE_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    return null;
  }

  return secret;
}

async function getSigningKey(): Promise<CryptoKey | null> {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );

  const binary = atob(padded);

  return Uint8Array.from(binary, (character) =>
    character.charCodeAt(0)
  );
}

export async function verifyAccessPassword(
  submittedPassword: string
): Promise<boolean> {
  const configuredPassword = process.env.AKIV_BASE_PASSWORD;

  if (
    !configuredPassword ||
    !submittedPassword ||
    submittedPassword.length > 1024
  ) {
    return false;
  }

  const key = await getSigningKey();

  if (!key) {
    return false;
  }

  const expectedSignature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`password:${configuredPassword}`)
  );

  return crypto.subtle.verify(
    "HMAC",
    key,
    expectedSignature,
    encoder.encode(`password:${submittedPassword}`)
  );
}

export async function createAccessToken(): Promise<string | null> {
  const key = await getSigningKey();

  if (!key) {
    return null;
  }

  const expiresAt =
    Date.now() + AKIV_BASE_SESSION_DURATION * 1000;

  const payload = `v1:${expiresAt}`;
  const payloadBytes = encoder.encode(payload);

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    payloadBytes
  );

  return `${toBase64Url(payloadBytes)}.${toBase64Url(
    new Uint8Array(signature)
  )}`;
}

export async function verifyAccessToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 2) {
      return false;
    }

    const [encodedPayload, encodedSignature] = parts;

    const payloadBytes = fromBase64Url(encodedPayload);
    const signatureBytes = fromBase64Url(encodedSignature);

    const payloadBuffer = new ArrayBuffer(
      payloadBytes.byteLength
    );

    new Uint8Array(payloadBuffer).set(payloadBytes);

    const signatureBuffer = new ArrayBuffer(
      signatureBytes.byteLength
    );

    new Uint8Array(signatureBuffer).set(signatureBytes);

    const key = await getSigningKey();

    if (!key) {
      return false;
    }

    const validSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      payloadBuffer
    );

    if (!validSignature) {
      return false;
    }

    const payload = new TextDecoder().decode(payloadBytes);
    const match = /^v1:(\d+)$/.exec(payload);

    if (!match) {
      return false;
    }

    const expiresAt = Number(match[1]);

    return (
      Number.isSafeInteger(expiresAt) &&
      expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}
