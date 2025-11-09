import { test, expect } from "@playwright/test";

test.describe("Contact Form - Phone Number Internationalization", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    // Wait for the page to fully load
    await page.waitForLoadState("networkidle");
  });

  test("should display Romanian country code by default", async ({ page }) => {
    // Check that Romanian flag and dial code are visible in the button
    const countrySelector = page.getByTestId("country-code-selector");
    await expect(countrySelector).toBeVisible();
    await expect(countrySelector).toContainText("🇷🇴");
    await expect(countrySelector).toContainText("+40");
  });

  test("should allow selecting different country codes", async ({ page }) => {
    // Open country selector
    await page.getByTestId("country-code-selector").click();

    // Wait for the dropdown to appear
    await page.waitForSelector("[cmdk-input]");

    // Search for United States
    await page.getByPlaceholder("Caută țară...").fill("United");

    // Wait a bit for filtering
    await page.waitForTimeout(500);

    // Select United States from filtered results
    await page.locator("[cmdk-item]", { hasText: "United States" }).click();

    // Verify US flag and dial code are now showing in the button
    const countrySelector = page.getByTestId("country-code-selector");
    await expect(countrySelector).toContainText("🇺🇸");
    await expect(countrySelector).toContainText("+1");
  });

  test("should filter countries in search", async ({ page }) => {
    // Open country selector
    await page.getByTestId("country-code-selector").click();

    // Wait for the dropdown
    await page.waitForSelector("[cmdk-input]");

    // Search for Deutschland (Germany in German)
    await page.getByPlaceholder("Caută țară...").fill("Deutschland");

    // Wait for filtering
    await page.waitForTimeout(500);

    // Deutschland should be visible as a command item
    await expect(
      page.locator("[cmdk-item]", { hasText: "Deutschland" }),
    ).toBeVisible();

    // Clear search and try France (in French: France)
    await page.getByPlaceholder("Caută țară...").clear();
    await page.getByPlaceholder("Caută țară...").fill("France");
    await page.waitForTimeout(500);

    // France should now be visible
    await expect(
      page.locator("[cmdk-item]", { hasText: "France" }),
    ).toBeVisible();
  });

  test("should display phone number input", async ({ page }) => {
    const phoneInput = page.getByTestId("phone-number-input");
    await expect(phoneInput).toBeVisible();
    await expect(phoneInput).toHaveAttribute("type", "tel");
    await expect(phoneInput).toHaveAttribute("placeholder", "Ex: 0745 234 566");
  });

  test("should accept phone number input", async ({ page }) => {
    const phoneInput = page.getByTestId("phone-number-input");

    // Type a Romanian phone number
    await phoneInput.fill("0712345678");

    // Verify the value
    await expect(phoneInput).toHaveValue("0712345678");
  });

  test("should display country flags correctly for multiple countries", async ({
    page,
  }) => {
    const testCountries = [
      { name: "Deutschland", flag: "🇩🇪", code: "+49" },
      { name: "France", flag: "🇫🇷", code: "+33" },
      { name: "Italia", flag: "🇮🇹", code: "+39" },
    ];

    for (const country of testCountries) {
      // Open country selector
      await page.getByTestId("country-code-selector").click();
      await page.waitForSelector("[cmdk-input]");

      // Search for country
      await page.getByPlaceholder("Caută țară...").fill(country.name);
      await page.waitForTimeout(500);

      // Select country
      await page.locator("[cmdk-item]", { hasText: country.name }).click();

      // Verify flag and dial code in the button
      const countrySelector = page.getByTestId("country-code-selector");
      await expect(countrySelector).toContainText(country.flag);
      await expect(countrySelector).toContainText(country.code);
    }
  });

  test("should have proper accessibility attributes", async ({ page }) => {
    const countrySelector = page.getByTestId("country-code-selector");

    // Should have combobox role
    await expect(countrySelector).toHaveAttribute("role", "combobox");

    // Should have aria-label
    await expect(countrySelector).toHaveAttribute("aria-label", "Cod țară");

    // Phone input should be focusable
    const phoneInput = page.getByTestId("phone-number-input");
    await phoneInput.focus();
    await expect(phoneInput).toBeFocused();
  });

  test("should be keyboard navigable", async ({ page }) => {
    const countrySelector = page.getByTestId("country-code-selector");

    // Focus and press Enter to open
    await countrySelector.focus();
    await countrySelector.press("Enter");

    // Wait for dropdown
    await page.waitForSelector("[cmdk-input]");

    // Type to search
    await page.keyboard.type("Deutschland");
    await page.waitForTimeout(500);

    // Should show Deutschland option
    await expect(
      page.locator("[cmdk-item]", { hasText: "Deutschland" }),
    ).toBeVisible();
  });
});
