import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import { UrlShortenerForm } from "./UrlShortenerForm";

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  globalThis.fetch = mockFetch;
});

const jsonResponse = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);

it("submits original URL and short code and displays the returned short URL", async () => {
  mockFetch.mockReturnValueOnce(
    jsonResponse({
      id: "1",
      originalUrl: "https://open.gov.sg/",
      shortCode: "open",
      shortUrl: "http://short.test/open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  );

  render(<UrlShortenerForm apiBaseUrl="http://api.test" />);

  await userEvent.type(screen.getByLabelText(/original url/i), "https://open.gov.sg/");
  await userEvent.type(screen.getByLabelText(/short code/i), "open");
  await userEvent.click(screen.getByRole("button", { name: /create short url/i }));

  expect(mockFetch).toHaveBeenCalledWith(
    "http://api.test/api/urls",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ originalUrl: "https://open.gov.sg/", shortCode: "open" }),
    }),
  );
  expect(await screen.findByText("http://short.test/open")).toBeInTheDocument();
});

it("blocks submission when the short code is missing", async () => {
  render(<UrlShortenerForm apiBaseUrl="http://api.test" />);

  await userEvent.type(screen.getByLabelText(/original url/i), "https://open.gov.sg/");
  await userEvent.click(screen.getByRole("button", { name: /create short url/i }));

  expect(mockFetch).not.toHaveBeenCalled();
  expect(screen.getByText("Enter a short code.")).toBeInTheDocument();
});

it("renders backend validation errors and preserves entered values", async () => {
  mockFetch.mockReturnValueOnce(
    jsonResponse(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Submitted values are invalid.",
          fieldErrors: {
            originalUrl: "Enter a valid URL.",
          },
        },
      },
      false,
      400,
    ),
  );

  render(<UrlShortenerForm apiBaseUrl="http://api.test" />);

  await userEvent.type(screen.getByLabelText(/original url/i), "not-a-url");
  await userEvent.type(screen.getByLabelText(/short code/i), "open");
  await userEvent.click(screen.getByRole("button", { name: /create short url/i }));

  expect(await screen.findByText("Enter a valid URL.")).toBeInTheDocument();
  expect(screen.getByLabelText(/original url/i)).toHaveValue("not-a-url");
  expect(screen.getByLabelText(/short code/i)).toHaveValue("open");
});

it("renders short-code conflict errors", async () => {
  mockFetch.mockReturnValueOnce(
    jsonResponse(
      {
        error: {
          code: "SHORT_CODE_TAKEN",
          message: "Choose a different short code.",
          fieldErrors: {
            shortCode: "This short code is already taken.",
          },
        },
      },
      false,
      409,
    ),
  );

  render(<UrlShortenerForm apiBaseUrl="http://api.test" />);

  await userEvent.type(screen.getByLabelText(/original url/i), "https://open.gov.sg/");
  await userEvent.type(screen.getByLabelText(/short code/i), "open");
  await userEvent.click(screen.getByRole("button", { name: /create short url/i }));

  expect(
    await screen.findByText("This short code is already taken. Choose a different short code."),
  ).toBeInTheDocument();
});
