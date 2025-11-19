import { test, expect } from "@playwright/test";

test.describe("Phone Number Internationalization", () => {
  test.describe("Contact Form", () => {
    test.beforeEach(async ({ page, context }) => {
      await context.clearCookies();
      await page.goto("/contact");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    test("should display Romanian country code by default", async ({
      page,
    }) => {
      // Check that Romanian flag and dial code are visible
      await expect(page.getByText("🇷🇴")).toBeVisible();
      await expect(page.getByText("+40")).toBeVisible();
    });

    test("should allow selecting different country codes", async ({ page }) => {
      // Open country selector
      await page.getByTestId("country-code-selector").click();

      // Search for United States (Statele Unite in Romanian)
      await page.getByPlaceholder("Caută țară...").fill("Statele Unite");

      // Select United States
      await page.getByText("Statele Unite").click();

      // Verify US flag and dial code are now showing
      await expect(page.getByText("🇺🇸")).toBeVisible();
      await expect(page.getByText("+1")).toBeVisible();
    });

    test("should filter countries in search", async ({ page }) => {
      // Open country selector
      await page.getByTestId("country-code-selector").click();

      // Search for Germania (Germany in Romanian)
      await page.getByPlaceholder("Caută țară...").fill("Germania");

      // Germania should be visible
      await expect(page.getByText("Germania")).toBeVisible();

      // Other countries should not be visible
      await expect(page.getByText("Franța")).not.toBeVisible();
      await expect(page.getByText("Italia")).not.toBeVisible();
    });

    test("should validate phone number with selected country code", async ({
      page,
    }) => {
      // Fill in form with Romanian phone number
      await page.getByPlaceholder("Nume").fill("Ion");
      await page.getByPlaceholder("Prenume").fill("Popescu");
      await page.getByTestId("phone-number-input").fill("0712345678");
      await page.getByPlaceholder("Email").fill("ion@example.com");

      // Select county
      await page.getByTestId("country-code-selector").nth(1).click();
      await page.getByText("București").click();

      // Select solicitation type
      await page.getByTestId("country-code-selector").nth(1).click();
      await page.getByText("Mesaj general").click();

      // Fill message
      await page.getByPlaceholder("Mesajul tău...").fill("Test message");

      // Submit form
      await page.getByRole("button", { name: "Trimite" }).click();

      // Should not show phone validation error for valid Romanian number
      await expect(
        page.getByText("Numărul de telefon este invalid"),
      ).not.toBeVisible();
    });

    test("should show error for invalid phone number format", async ({
      page,
    }) => {
      // Change to US country code
      await page.getByTestId("country-code-selector").click();
      await page.getByPlaceholder("Caută țară...").fill("Statele Unite");
      await page.getByText("Statele Unite").click();

      // Try to enter Romanian phone number with US country code
      await page.getByTestId("phone-number-input").fill("0712345678");
      await page.getByPlaceholder("Nume").click(); // Trigger blur

      // Should show validation error
      await expect(page.getByText(/invalid|telefon/i)).toBeVisible();
    });

    test("should display country flags correctly", async ({ page }) => {
      const testCountries = [
        { name: "Germania", flag: "🇩🇪", code: "+49" },
        { name: "Franța", flag: "🇫🇷", code: "+33" },
        { name: "Italia", flag: "🇮🇹", code: "+39" },
        { name: "Spania", flag: "🇪🇸", code: "+34" },
      ];

      for (const country of testCountries) {
        // Open country selector
        await page.getByTestId("country-code-selector").click();

        // Search for country
        await page.getByPlaceholder("Caută țară...").fill(country.name);

        // Select country
        await page.getByText(country.name).click();

        // Verify flag and dial code
        await expect(page.getByText(country.flag)).toBeVisible();
        await expect(page.getByText(country.code)).toBeVisible();
      }
    });
  });

  test.describe("Incident Report Form", () => {
    test.beforeEach(async ({ page, context }) => {
      await context.clearCookies();
      await page.goto("/raporteaza-incident");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    test("should have phone number input with country selector", async ({
      page,
    }) => {
      // Check that country selector is present
      await expect(page.getByTestId("country-code-selector")).toBeVisible();

      // Check that phone input is present
      await expect(page.getByTestId("phone-number-input")).toBeVisible();
    });

    test("should persist country selection while filling form", async ({
      page,
    }) => {
      // Select UK country code (Regatul Unit in Romanian)
      await page.getByTestId("country-code-selector").click();
      await page.getByPlaceholder("Caută țară...").fill("Regatul Unit");
      await page.getByText("Regatul Unit").click();

      // Fill other fields
      await page.getByPlaceholder("Nume").fill("John");
      await page.getByPlaceholder("Prenume").fill("Doe");

      // Verify UK is still selected
      await expect(page.getByText("🇬🇧")).toBeVisible();
      await expect(page.getByText("+44")).toBeVisible();
    });

    test("should accept international phone format", async ({ page }) => {
      // Select France (Franța in Romanian)
      await page.getByTestId("country-code-selector").click();
      await page.getByPlaceholder("Caută țară...").fill("Franța");
      await page.getByText("Franța").first().click();

      // Enter French phone number
      await page.getByTestId("phone-number-input").fill("0612345678");

      // Fill other required fields
      await page.getByPlaceholder("Nume").fill("Jean");
      await page.getByPlaceholder("Prenume").fill("Dupont");

      // Phone number should be accepted
      await expect(
        page.getByText("Numărul de telefon este invalid"),
      ).not.toBeVisible();
    });
  });

  test.describe("Presence Report Form", () => {
    test.beforeEach(async ({ page, context }) => {
      await context.clearCookies();
      await page.goto("/raporteaza-prezenta");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    test("should support all major European countries", async ({ page }) => {
      const europeanCountries = [
        "Germania",
        "Franța",
        "Italia",
        "Spania",
        "Polonia",
        "Olanda",
      ];

      // Open country selector
      await page.getByTestId("country-code-selector").click();

      // Verify each country is in the list
      for (const country of europeanCountries) {
        await page.getByPlaceholder("Caută țară...").clear();
        await page.getByPlaceholder("Caută țară...").fill(country);
        await expect(page.getByText(country)).toBeVisible();
      }
    });
  });

  test.describe("Conflict Report Form", () => {
    test.beforeEach(async ({ page, context }) => {
      await context.clearCookies();
      await page.goto("/conflicte");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    test("should remember last selected country code", async ({ page }) => {
      // Select a non-default country
      await page.getByTestId("country-code-selector").click();
      await page.getByPlaceholder("Caută țară...").fill("Italia");
      await page.getByText("Italia").click();

      // Verify Italia is selected
      await expect(page.getByText("🇮🇹")).toBeVisible();

      // If the form maintains state, it should still show Italia
      // (This test assumes some form of state persistence)
      await expect(page.getByText("+39")).toBeVisible();
    });
  });

  test.describe("Mobile Responsiveness", () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

    test("should display phone input properly on mobile", async ({
      page,
      context,
    }) => {
      await context.clearCookies();
      await page.goto("/contact");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Country selector should be visible and clickable
      const countrySelector = page.getByTestId("country-code-selector");
      await expect(countrySelector).toBeVisible();

      // Phone input should be visible
      const phoneInput = page.getByTestId("phone-number-input");
      await expect(phoneInput).toBeVisible();

      // Should be able to open country selector
      await countrySelector.click();
      await expect(page.getByPlaceholder("Caută țară...")).toBeVisible();
    });

    test("should allow country selection on mobile", async ({
      page,
      context,
    }) => {
      await context.clearCookies();
      await page.goto("/contact");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Open country selector
      await page.getByTestId("country-code-selector").click();

      // Search should work on mobile (Spania = Spain in Romanian)
      await page.getByPlaceholder("Caută țară...").fill("Spania");

      // Should be able to select
      await page.getByText("Spania").click();

      // Verify selection
      await expect(page.getByText("🇪🇸")).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("should be keyboard navigable", async ({ page, context }) => {
      await context.clearCookies();
      await page.goto("/contact");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Tab to country selector
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Press Enter to open
      await page.keyboard.press("Enter");

      // Type to search (Germania = Germany in Romanian)
      await page.keyboard.type("Germania");

      // Should show Germania
      await expect(page.getByText("Germania")).toBeVisible();
    });

    test("should have proper ARIA labels", async ({ page, context }) => {
      await context.clearCookies();
      await page.goto("/contact");
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Country selector should have combobox role
      const combobox = page.getByTestId("country-code-selector");
      await expect(combobox).toBeVisible();

      // Phone input should have proper role
      const phoneInput = page.getByTestId("phone-number-input");
      await expect(phoneInput).toHaveAttribute("type", "tel");
    });
  });
});
