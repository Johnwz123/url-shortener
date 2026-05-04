import { randomInt } from "node:crypto";

import { AppError } from "../errors.js";
import type { UrlMappingRepository } from "../repositories/url-mapping.repository.js";
import {
  SHORT_CODE_MAX_LENGTH,
  SHORT_CODE_MIN_LENGTH,
  SHORT_CODE_PATTERN,
} from "../validation/url.validation.js";

export type ShortCodeGenerationOptions = {
  minLength: number;
  maxLength: number;
  maxAttempts: number;
};

const SHORT_CODE_CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789-";

const generateRandomShortCode = (length: number): string =>
  Array.from({ length }, () => SHORT_CODE_CHARSET[randomInt(SHORT_CODE_CHARSET.length)]).join("");

const selectRandomLength = (minLength: number, maxLength: number): number => {
  if (!Number.isFinite(minLength) || !Number.isFinite(maxLength)) {
    throw new AppError(
      500,
      "SHORT_CODE_GENERATION_FAILED",
      "Unable to generate a short code. Please try again.",
    );
  }

  const flooredMin = Math.floor(minLength);
  const flooredMax = Math.floor(maxLength);

  if (flooredMin <= 0) {
    throw new AppError(
      500,
      "SHORT_CODE_GENERATION_FAILED",
      "Unable to generate a short code. Please try again.",
    );
  }

  if (flooredMin === flooredMax) {
    return flooredMin;
  }

  const normalizedMin = Math.min(flooredMin, flooredMax);
  const normalizedMax = Math.max(flooredMin, flooredMax);
  return randomInt(normalizedMin, normalizedMax + 1);
};

export const generateShortCode = async (
  repository: UrlMappingRepository,
  options: ShortCodeGenerationOptions,
): Promise<string> => {
  const { minLength, maxLength, maxAttempts } = options;

  if (!Number.isFinite(minLength) || !Number.isFinite(maxLength)) {
    throw new AppError(
      500,
      "SHORT_CODE_GENERATION_FAILED",
      "Unable to generate a short code. Please try again.",
    );
  }

  // Clamp and floor generation bounds to the same limits used by the
  // short-code creation validator, so every generated code is guaranteed
  // to be accepted by the POST /api/urls endpoint.
  const clampedMin = Math.max(
    SHORT_CODE_MIN_LENGTH,
    Math.min(SHORT_CODE_MAX_LENGTH, Math.floor(minLength)),
  );
  const clampedMax = Math.max(
    SHORT_CODE_MIN_LENGTH,
    Math.min(SHORT_CODE_MAX_LENGTH, Math.floor(maxLength)),
  );

  const attempts = Number.isFinite(maxAttempts) ? Math.max(1, Math.floor(maxAttempts)) : 1;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const length = selectRandomLength(clampedMin, clampedMax);
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
