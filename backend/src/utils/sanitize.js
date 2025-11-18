export function stripControlChars(str) {
  if (typeof str !== "string") return "";

  return str
    .normalize("NFC")

    .replace(/[\x00-\x1F\x7F]/g, "")

    .replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, "");
}

export function sanitizeBasicField(str) {
  if (typeof str !== "string") return "";

  let out = stripControlChars(str);

  out = out.trim().replace(/\s+/g, " ");

  out = out.replace(/[<>`]/g, "");

  return out;
}

export function sanitizeDescriptionField(str) {
  if (typeof str !== "string") return "";

  let out = stripControlChars(str);

  out = out.trim().replace(/\s+/g, " ");

  return out;
}
