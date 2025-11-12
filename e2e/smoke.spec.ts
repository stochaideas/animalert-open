import { test, expect } from "@playwright/test";

test.describe("Basic Application Health", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AnimAlert/i);
  });

  test("should load the contact page", async ({ page }) => {
    await page.goto("/contact");

    // Check for phone input component (Playwright auto-waits for visibility)
    await expect(page.getByTestId("phone-number-input")).toBeVisible();
  });

  test("should load incident report page", async ({ page }) => {
    await page.goto("/raporteaza-incident");

    // Should have form elements (Playwright auto-waits for visibility)
    await expect(page.getByTestId("phone-number-input")).toBeVisible();
  });
});
