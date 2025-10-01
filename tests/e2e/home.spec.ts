import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test("displays hero action and informational card", async ({ page }) => {
    await page.goto("/");

    const reportLink = page
      .getByRole("link", { name: /Raportează incident/ })
      .first();
    await expect(reportLink).toBeVisible();
    await expect(reportLink).toHaveAttribute("href", "/raporteaza-incident");

    await page.goto("/raporteaza-incident");
    await expect(
      page.getByRole("heading", { level: 1, name: "Raportează incident" }),
    ).toBeVisible();

    await page.goto("/");

    const infoCard = page.getByRole("heading", {
      level: 2,
      name: "Observare Prezență Animale & Raportări",
    });
    await expect(infoCard).toBeVisible();

    await expect(
      page.getByText("Raportează prezență", { exact: true }),
    ).toBeVisible();
  });
});
