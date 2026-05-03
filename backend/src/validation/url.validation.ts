import { isIP } from "node:net";

import { validationError } from "../errors.js";

export const SHORT_CODE_MIN_LENGTH = 3;
export const SHORT_CODE_MAX_LENGTH = 64;
export const SHORT_CODE_PATTERN = /^[a-z0-9-]+$/;
const URL_PROTOCOL_PATTERN = /^[a-z][a-z\d+.-]*:\/\//i;

export const normalizeShortCode = (value: string): string => value.trim().toLowerCase();

const addDefaultProtocol = (value: string): string =>
  URL_PROTOCOL_PATTERN.test(value) ? value : `https://${value}`;

const isValidHostname = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase();
  const ipHost =
    normalized.startsWith("[") && normalized.endsWith("]")
      ? normalized.slice(1, -1)
      : normalized;

  return normalized === "localhost" || isIP(ipHost) !== 0 || normalized.includes(".");
};

export const validateOriginalUrl = (value: unknown): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw validationError({ originalUrl: "Enter an original URL." });
  }

  let parsed: URL;
  try {
    parsed = new URL(addDefaultProtocol(value.trim()));
  } catch {
    throw validationError({ originalUrl: "Enter a valid URL." });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw validationError({ originalUrl: "Only http and https URLs are supported." });
  }

  if (!isValidHostname(parsed.hostname)) {
    throw validationError({ originalUrl: "Enter a valid URL." });
  }

  return parsed.toString();
};

export const validateShortCode = (value: unknown): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw validationError({ shortCode: "Enter a short code." });
  }

  const normalized = normalizeShortCode(value);

  if (
    normalized.length < SHORT_CODE_MIN_LENGTH ||
    normalized.length > SHORT_CODE_MAX_LENGTH
  ) {
    throw validationError({
      shortCode: `Short code must be ${SHORT_CODE_MIN_LENGTH}-${SHORT_CODE_MAX_LENGTH} characters.`,
    });
  }

  if (!SHORT_CODE_PATTERN.test(normalized)) {
    throw validationError({
      shortCode: "Use only letters, numbers, and hyphens.",
    });
  }

  return normalized;
};
