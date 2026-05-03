import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { App } from "./App";
import { ROUTES } from "./routes";

it("renders the shortener form on standard routes", () => {
  render(<App apiBaseUrl="http://api.test" routePath={ROUTES.home} />);

  expect(screen.getByRole("heading", { name: "URL Shortener" })).toBeInTheDocument();
});

it("renders the frontend 404 route", () => {
  render(<App apiBaseUrl="http://api.test" routePath={ROUTES.notFound} />);

  expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  expect(screen.getByText("Short link not found")).toBeInTheDocument();
});
