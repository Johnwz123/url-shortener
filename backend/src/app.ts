import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import type { AppConfig } from "./config/app.config.js";
import { AppError, isAppError } from "./errors.js";
import type { AppRepositories } from "./repositories/app.repositories.js";
import { generateShortCode } from "./services/short-code.service.js";
import { createShortUrl, findOriginalUrl } from "./services/url.service.js";

export type CreateAppOptions = {
  config: AppConfig;
  repositories: AppRepositories;
};

const frontendNotFoundUrl = (config: AppConfig, shortCode: string): string => {
  const target = new URL(config.frontendNotFoundPath, config.frontendBaseUrl);
  target.searchParams.set("code", shortCode);
  return target.toString();
};

const sendError = (res: Response, error: AppError): void => {
  res.status(error.statusCode).json({
    error: {
      code: error.code,
      message: error.message,
      fieldErrors: error.fieldErrors,
    },
  });
};

export const createApp = ({ config, repositories }: CreateAppOptions) => {
  const app = express();

  app.use(cors({ origin: config.corsOrigin ?? config.frontendBaseUrl }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/urls", async (req, res, next) => {
    try {
      const result = await createShortUrl(
        req.body,
        repositories.urlMappings,
        config.publicBaseUrl,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/short-codes/generate", async (_req, res, next) => {
    try {
      const shortCode = await generateShortCode(repositories.urlMappings, {
        minLength: config.shortCodeGenerationMinLength,
        maxLength: config.shortCodeGenerationMaxLength,
        maxAttempts: config.shortCodeGenerationMaxAttempts,
      });
      res.status(200).json({ shortCode });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api", (_req, res) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "API route not found.",
      },
    });
  });

  app.get("/:code", async (req, res, next) => {
    try {
      const originalUrl = await findOriginalUrl(req.params.code, repositories.urlMappings);

      if (originalUrl) {
        res.redirect(302, originalUrl);
        return;
      }

      res.redirect(302, frontendNotFoundUrl(config, req.params.code));
    } catch (error) {
      next(error);
    }
  });

  app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
    void next;

    if (isAppError(error)) {
      sendError(res, error);
      return;
    }

    console.error(error);
    sendError(res, new AppError(500, "INTERNAL_SERVER_ERROR", "Unexpected server error."));
  });

  return app;
};
