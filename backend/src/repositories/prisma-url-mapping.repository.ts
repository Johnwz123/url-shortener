import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import { ShortCodeConflictError } from "./url-mapping.repository.js";
import type {
  CreateUrlMappingInput,
  UrlMapping,
  UrlMappingRepository,
} from "./url-mapping.repository.js";

const PRISMA_UNIQUE_CONSTRAINT_ERROR_CODE = "P2002";

export class PrismaUrlMappingRepository implements UrlMappingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(input: CreateUrlMappingInput): Promise<UrlMapping> {
    try {
      return await this.prisma.urlMapping.create({
        data: {
          originalUrl: input.originalUrl,
          shortCode: input.shortCode,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR_CODE
      ) {
        throw new ShortCodeConflictError(input.shortCode);
      }

      throw error;
    }
  }

  async findByShortCode(shortCode: string): Promise<UrlMapping | null> {
    return this.prisma.urlMapping.findUnique({
      where: { shortCode },
    });
  }
}
