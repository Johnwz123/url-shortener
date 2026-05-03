export type AppConfig = {
  port: number;
  publicBaseUrl: string;
  frontendBaseUrl: string;
  frontendNotFoundPath: string;
  corsOrigin?: string;
  nodeEnv: string;
  shortCodeGenerationMinLength: number;
  shortCodeGenerationMaxLength: number;
  shortCodeGenerationMaxAttempts: number;
};

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

export const normalizeBaseUrl = (value: string): string => stripTrailingSlash(value.trim());

export const loadConfig = (env: NodeJS.ProcessEnv = process.env): AppConfig => ({
  port: Number(env.PORT ?? 3000),
  publicBaseUrl: normalizeBaseUrl(env.PUBLIC_BASE_URL ?? "http://localhost:3000"),
  frontendBaseUrl: normalizeBaseUrl(env.FRONTEND_BASE_URL ?? "http://localhost:5173"),
  frontendNotFoundPath: env.FRONTEND_NOT_FOUND_PATH ?? "/404",
  corsOrigin: env.CORS_ORIGIN,
  nodeEnv: env.NODE_ENV ?? "development",
  shortCodeGenerationMinLength: Number(env.SHORT_CODE_GENERATION_MIN_LENGTH ?? 6),
  shortCodeGenerationMaxLength: Number(env.SHORT_CODE_GENERATION_MAX_LENGTH ?? 10),
  shortCodeGenerationMaxAttempts: Number(env.SHORT_CODE_GENERATION_MAX_ATTEMPTS ?? 10),
});
