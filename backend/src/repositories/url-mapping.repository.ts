export type UrlMapping = {
  id: string;
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUrlMappingInput = {
  originalUrl: string;
  shortCode: string;
};

export class ShortCodeConflictError extends Error {
  constructor(shortCode: string) {
    super(`Short code already exists: ${shortCode}`);
  }
}

export interface UrlMappingRepository {
  create(input: CreateUrlMappingInput): Promise<UrlMapping>;
  findByShortCode(shortCode: string): Promise<UrlMapping | null>;
}
