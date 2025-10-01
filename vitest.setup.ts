import "@testing-library/jest-dom/vitest";

// Mock next/navigation hooks when running unit tests that may rely on them
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
