import { AppError } from "../errors.js";
import { ShortCodeConflictError } from "../repositories/url-mapping.repository.js";
import type { UrlMappingRepository } from "../repositories/url-mapping.repository.js";
import { validateOriginalUrl, validateShortCode } from "../validation/url.validation.js";

export type CreateShortUrlInput = {
  originalUrl?: unknown;
  shortCode?: unknown;
};

export type CreateShortUrlResult = {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  updatedAt: string;
};

export const buildShortUrl = (publicBaseUrl: string, shortCode: string): string =>
  new URL(`/${shortCode}`, publicBaseUrl).toString();

export const createShortUrl = async (
  input: CreateShortUrlInput,
  repository: UrlMappingRepository,
  publicBaseUrl: string,
): Promise<CreateShortUrlResult> => {
  const originalUrl = validateOriginalUrl(input.originalUrl);
  const shortCode = validateShortCode(input.shortCode);

  try {
    const mapping = await repository.create({ originalUrl, shortCode });

    return {
      id: mapping.id,
      originalUrl: mapping.originalUrl,
      shortCode: mapping.shortCode,
      shortUrl: buildShortUrl(publicBaseUrl, mapping.shortCode),
      createdAt: mapping.createdAt.toISOString(),
      updatedAt: mapping.updatedAt.toISOString(),
    };
  } catch (error) {
    if (error instanceof ShortCodeConflictError) {
      throw new AppError(409, "SHORT_CODE_TAKEN", "Choose a different short code.", {
        shortCode: "This short code is already taken.",
      });
    }

    throw error;
  }
};

export const findOriginalUrl = async (
  rawShortCode: string,
  repository: UrlMappingRepository,
): Promise<string | null> => {
  const shortCode = validateShortCode(rawShortCode);
  const mapping = await repository.findByShortCode(shortCode);

  return mapping?.originalUrl ?? null;
};
