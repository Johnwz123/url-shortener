import { ShortCodeConflictError } from "../../src/repositories/url-mapping.repository.js";
import type {
  CreateUrlMappingInput,
  UrlMapping,
  UrlMappingRepository,
} from "../../src/repositories/url-mapping.repository.js";

export class InMemoryUrlMappingRepository implements UrlMappingRepository {
  private readonly mappings = new Map<string, UrlMapping>();

  async create(input: CreateUrlMappingInput): Promise<UrlMapping> {
    if (this.mappings.has(input.shortCode)) {
      throw new ShortCodeConflictError(input.shortCode);
    }

    const now = new Date();
    const mapping: UrlMapping = {
      id: `mapping-${this.mappings.size + 1}`,
      shortCode: input.shortCode,
      originalUrl: input.originalUrl,
      createdAt: now,
      updatedAt: now,
    };

    this.mappings.set(input.shortCode, mapping);
    return mapping;
  }

  async findByShortCode(shortCode: string): Promise<UrlMapping | null> {
    return this.mappings.get(shortCode) ?? null;
  }
}
