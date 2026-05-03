import { describe, expect, it } from "vitest";
import { AppError } from "../errors.js";
import { normalizeShortCode, validateOriginalUrl, validateShortCode } from "./url.validation.js";

const expectValidationError = (fn: () => unknown, field: string, message: string) => {
  expect(fn).toThrow(AppError);

  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).statusCode).toBe(400);
    expect((error as AppError).fieldErrors).toMatchObject({ [field]: message });
  }
};

describe("URL validation", () => {
  it("normalizes valid original URLs and adds https when no protocol is provided", () => {
    expect(validateOriginalUrl("open.gov.sg")).toBe("https://open.gov.sg/");
    expect(validateOriginalUrl("http://example.com/path")).toBe("http://example.com/path");
  });

  it("rejects unsupported or malformed original URLs", () => {
    expectValidationError(() => validateOriginalUrl(""), "originalUrl", "Enter an original URL.");
    expectValidationError(
      () => validateOriginalUrl("ftp://example.com"),
      "originalUrl",
      "Only http and https URLs are supported.",
    );
    expectValidationError(
      () => validateOriginalUrl("not-a-url"),
      "originalUrl",
      "Enter a valid URL.",
    );
  });
});

describe("short code validation", () => {
  it("normalizes valid short codes", () => {
    expect(normalizeShortCode(" Open-Link ")).toBe("open-link");
    expect(validateShortCode(" Open-Link ")).toBe("open-link");
  });

  it("requires a short code", () => {
    expectValidationError(() => validateShortCode(""), "shortCode", "Enter a short code.");
  });

  it("rejects invalid short-code characters and length", () => {
    expectValidationError(
      () => validateShortCode("bad_code"),
      "shortCode",
      "Use only letters, numbers, and hyphens.",
    );
    expectValidationError(
      () => validateShortCode("ab"),
      "shortCode",
      "Short code must be 3-64 characters.",
    );
  });
});
