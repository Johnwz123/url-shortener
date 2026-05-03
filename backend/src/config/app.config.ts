export type AppConfig = {
  port: number;
  publicBaseUrl: string;
  frontendBaseUrl: string;
  frontendNotFoundPath: string;
  corsOrigin?: string;
  nodeEnv: string;
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
});
