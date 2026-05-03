import { randomInt } from "node:crypto";

import { AppError } from "../errors.js";
import type { UrlMappingRepository } from "../repositories/url-mapping.repository.js";
import { SHORT_CODE_PATTERN } from "../validation/url.validation.js";

export type ShortCodeGenerationOptions = {
  minLength: number;
  maxLength: number;
  maxAttempts: number;
};

const SHORT_CODE_CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789-";

const generateRandomShortCode = (length: number): string =>
  Array.from({ length }, () => SHORT_CODE_CHARSET[randomInt(SHORT_CODE_CHARSET.length)]).join("");

const selectRandomLength = (minLength: number, maxLength: number): number => {
  if (!Number.isFinite(minLength) || !Number.isFinite(maxLength) || minLength <= 0) {
    throw new AppError(
      500,
      "SHORT_CODE_GENERATION_FAILED",
      "Unable to generate a short code. Please try again.",
    );
  }

  if (minLength === maxLength) {
    return minLength;
  }

  const normalizedMin = Math.min(minLength, maxLength);
  const normalizedMax = Math.max(minLength, maxLength);
  return randomInt(normalizedMin, normalizedMax + 1);
};

export const generateShortCode = async (
  repository: UrlMappingRepository,
  options: ShortCodeGenerationOptions,
): Promise<string> => {
  const { minLength, maxLength, maxAttempts } = options;
  if (minLength <= 0 || maxLength <= 0) {
    throw new AppError(
      500,
      "SHORT_CODE_GENERATION_FAILED",
      "Unable to generate a short code. Please try again.",
    );
  }
  const attempts = Number.isFinite(maxAttempts) ? Math.max(1, Math.floor(maxAttempts)) : 1;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const length = selectRandomLength(minLength, maxLength);
    const candidate = generateRandomShortCode(length);

    if (!SHORT_CODE_PATTERN.test(candidate)) {
      continue;
    }

    const existing = await repository.findByShortCode(candidate);
    if (!existing) {
      return candidate;
    }
  }

  throw new AppError(
    503,
    "SHORT_CODE_GENERATION_FAILED",
    "Unable to generate a short code. Please try again.",
  );
};
