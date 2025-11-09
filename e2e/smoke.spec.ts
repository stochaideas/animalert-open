import { test, expect } from "@playwright/test";

test.describe("Basic Application Health", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AnimAlert/i);
  });

  test("should load the contact page", async ({ page }) => {
    await page.goto("/contact");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check for phone input component
    await expect(page.getByTestId("phone-number-input")).toBeVisible();
  });

  test("should load incident report page", async ({ page }) => {
    await page.goto("/raporteaza-incident");
    await page.waitForLoadState("networkidle");

    // Should have form elements
    await expect(page.getByTestId("phone-number-input")).toBeVisible();
  });
});
