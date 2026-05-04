export type CreateShortUrlRequest = {
  originalUrl: string;
  shortCode: string;
};

export type CreateShortUrlResponse = {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type GenerateShortCodeResponse = {
  shortCode: string;
};

export type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    fieldErrors?: Record<string, string>;
  };
};

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
  }
}

const apiUrl = (baseUrl: string, path: string): string => {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  return normalizedBase ? `${normalizedBase}${path}` : path;
};

export const createShortUrl = async (
  request: CreateShortUrlRequest,
  apiBaseUrl: string,
): Promise<CreateShortUrlResponse> => {
  const response = await fetch(apiUrl(apiBaseUrl, "/api/urls"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const body = (await response.json()) as CreateShortUrlResponse | ApiErrorBody;

  if (!response.ok) {
    const error = (body as ApiErrorBody).error;
    throw new ApiClientError(
      response.status,
      error?.code ?? "REQUEST_FAILED",
      error?.message ?? "Request failed.",
      error?.fieldErrors,
    );
  }

  return body as CreateShortUrlResponse;
};

export const generateShortCode = async (apiBaseUrl: string): Promise<GenerateShortCodeResponse> => {
  const response = await fetch(apiUrl(apiBaseUrl, "/api/short-codes/generate"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = (await response.json()) as GenerateShortCodeResponse | ApiErrorBody;

  if (!response.ok) {
    const error = (body as ApiErrorBody).error;
    throw new ApiClientError(
      response.status,
      error?.code ?? "REQUEST_FAILED",
      error?.message ?? "Request failed.",
      error?.fieldErrors,
    );
  }

  return body as GenerateShortCodeResponse;
};
