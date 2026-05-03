import type { PrismaClient } from "@prisma/client";
import { PrismaUrlMappingRepository } from "./prisma-url-mapping.repository.js";
import type { UrlMappingRepository } from "./url-mapping.repository.js";

export type AppRepositories = {
  urlMappings: UrlMappingRepository;
};

export const createRepositories = (prisma: PrismaClient): AppRepositories => ({
  urlMappings: new PrismaUrlMappingRepository(prisma),
});
