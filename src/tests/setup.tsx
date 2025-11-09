import "@testing-library/jest-dom";
import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Extend Vitest's expect method with methods from react-testing-library
expect.extend({});

// Cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Next.js fonts
vi.mock("next/font/google", () => ({
  Poppins: () => ({
    className: "poppins-mock",
    style: { fontFamily: "Poppins, sans-serif" },
  }),
  Inter: () => ({
    className: "inter-mock",
    style: { fontFamily: "Inter, sans-serif" },
  }),
  Roboto: () => ({
    className: "roboto-mock",
    style: { fontFamily: "Roboto, sans-serif" },
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = "test-api-key";
process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID = "test-map-id";
