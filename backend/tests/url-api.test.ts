import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import type { AppConfig } from "../src/config/app.config.js";
import { SHORT_CODE_PATTERN } from "../src/validation/url.validation.js";
import type { UrlMappingRepository } from "../src/repositories/url-mapping.repository.js";
import { InMemoryUrlMappingRepository } from "./helpers/in-memory-url-mapping.repository.js";

const config: AppConfig = {
  port: 0,
  publicBaseUrl: "http://short.test",
  frontendBaseUrl: "http://frontend.test",
  frontendNotFoundPath: "/404",
  corsOrigin: "http://frontend.test",
  nodeEnv: "test",
  shortCodeGenerationMinLength: 6,
  shortCodeGenerationMaxLength: 8,
  shortCodeGenerationMaxAttempts: 5,
};

const createTestApp = () => {
  const urlMappings = new InMemoryUrlMappingRepository();
  const repositories = { urlMappings };

  return {
    repositories,
    app: createApp({ config, repositories }),
  };
};

const createTestAppWithRepository = (repository: UrlMappingRepository) => {
  const repositories = { urlMappings: repository };

  return {
    repositories,
    app: createApp({ config, repositories }),
  };
};

describe("URL API", () => {
  it("creates a URL mapping with a required short code", async () => {
    const { app } = createTestApp();

    const response = await request(app)
      .post("/api/urls")
      .send({ originalUrl: "https://open.gov.sg/", shortCode: "open" })
      .expect(201);

    expect(response.body).toMatchObject({
      originalUrl: "https://open.gov.sg/",
      shortCode: "open",
      shortUrl: "http://short.test/open",
    });
  });

  it("accepts URLs without a protocol and stores them as https URLs", async () => {
    const { app } = createTestApp();

    const response = await request(app)
      .post("/api/urls")
      .send({ originalUrl: "google.com", shortCode: "google" })
      .expect(201);

    expect(response.body).toMatchObject({
      originalUrl: "https://google.com/",
      shortCode: "google",
      shortUrl: "http://short.test/google",
    });
  });

  it("normalizes uppercase short codes", async () => {
    const { app } = createTestApp();

    const response = await request(app)
      .post("/api/urls")
      .send({ originalUrl: "https://example.com/", shortCode: "Open-Link" })
      .expect(201);

    expect(response.body.shortCode).toBe("open-link");
  });

  it("rejects missing, malformed, and unsupported original URLs", async () => {
    const { app } = createTestApp();

    await request(app).post("/api/urls").send({ shortCode: "open" }).expect(400);
    await request(app)
      .post("/api/urls")
      .send({ originalUrl: "not-a-url", shortCode: "open" })
      .expect(400);
    await request(app)
      .post("/api/urls")
      .send({ originalUrl: "ftp://example.com", shortCode: "open" })
      .expect(400);
  });

  it("rejects missing, malformed, and out-of-bounds short codes", async () => {
    const { app } = createTestApp();

    await request(app).post("/api/urls").send({ originalUrl: "https://example.com" }).expect(400);
    await request(app)
      .post("/api/urls")
      .send({ originalUrl: "https://example.com", shortCode: "bad_code" })
      .expect(400);
    await request(app)
      .post("/api/urls")
      .send({ originalUrl: "https://example.com", shortCode: "ab" })
      .expect(400);
  });

  it("returns conflict for duplicate short code and preserves the original mapping", async () => {
    const { app, repositories } = createTestApp();

    await request(app)
      .post("/api/urls")
      .send({ originalUrl: "https://first.example.com/", shortCode: "open" })
      .expect(201);

    const conflict = await request(app)
      .post("/api/urls")
      .send({ originalUrl: "https://second.example.com/", shortCode: "open" })
      .expect(409);

    expect(conflict.body.error.code).toBe("SHORT_CODE_TAKEN");
    await expect(repositories.urlMappings.findByShortCode("open")).resolves.toMatchObject({
      originalUrl: "https://first.example.com/",
    });
  });

  it("redirects known short codes to the full stored destination", async () => {
    const { app } = createTestApp();
    const destination = "https://example.com/path?search=value#section";

    await request(app).post("/api/urls").send({ originalUrl: destination, shortCode: "docs" });

    const response = await request(app).get("/docs").expect(302);

    expect(response.headers.location).toBe(destination);
  });

  it("redirects missing short codes to the frontend 404 route", async () => {
    const { app } = createTestApp();

    const response = await request(app).get("/missing").expect(302);

    expect(response.headers.location).toBe("http://frontend.test/404?code=missing");
  });

  it("does not treat API routes as short-code lookups", async () => {
    const { app } = createTestApp();

    const response = await request(app).get("/api/not-real").expect(404);

    expect(response.headers.location).toBeUndefined();
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  it("returns health status", async () => {
    const { app } = createTestApp();

    await request(app).get("/health").expect(200, { status: "ok" });
  });

  it("generates a unique short code", async () => {
    const { app } = createTestApp();

    const response = await request(app).post("/api/short-codes/generate").expect(200);

    expect(response.body.shortCode).toMatch(SHORT_CODE_PATTERN);
    expect(response.body.shortCode.length).toBeGreaterThanOrEqual(
      config.shortCodeGenerationMinLength,
    );
    expect(response.body.shortCode.length).toBeLessThanOrEqual(
      config.shortCodeGenerationMaxLength,
    );
  });

  it("returns generation failure errors when no unique short code is found", async () => {
    const alwaysTakenRepository: UrlMappingRepository = {
      create: async () => {
        throw new Error("Not used");
      },
      findByShortCode: async () => ({
        id: "existing",
        shortCode: "taken",
        originalUrl: "https://example.com/",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };
    const { app } = createTestAppWithRepository(alwaysTakenRepository);

    const response = await request(app).post("/api/short-codes/generate").expect(503);

    expect(response.body.error.code).toBe("SHORT_CODE_GENERATION_FAILED");
  });
});
