export const MAX_MESSAGE_LENGTH = 500;

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getRequestOrigin(request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");

  if (!host) {
    return null;
  }

  return `${forwardedProto || "https"}://${host}`;
}

export function assertSameOrigin(request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return;
  }

  const allowedOrigin = getRequestOrigin(request);

  if (!allowedOrigin || origin !== allowedOrigin) {
    throw new Error("Cross-origin kerest nem engedelyezett.");
  }
}

export function assertJsonRequest(request) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error("A kerelem torzsenek JSON formatumuak kell lennie.");
  }
}

export function validateMessageContent(value) {
  const content = typeof value === "string" ? value.trim() : "";

  if (!content) {
    throw new Error("Ures uzenet nem mentheto.");
  }

  if (content.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Az uzenet legfeljebb ${MAX_MESSAGE_LENGTH} karakter lehet.`);
  }

  return content;
}

export function validateMessageId(id) {
  if (!UUID_V4_PATTERN.test(id || "")) {
    throw new Error("Ervenytelen bejegyzesazonosito.");
  }

  return id;
}

export function getNoStoreHeaders() {
  return {
    "Cache-Control": "no-store, max-age=0"
  };
}
