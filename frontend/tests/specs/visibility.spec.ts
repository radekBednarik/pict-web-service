import { test, expect } from "@playwright/test";
import MainPage from "../page-objects/mainPage";

test.describe("visibility", () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);

    await mainPage.visit();
  });

  test("on-load elements are visible/not visible", async () => {
    await expect.soft(mainPage.locMainHeading).toBeVisible();
    await expect.soft(mainPage.locBttnThemeSwitch).toBeVisible();
    await expect.soft(mainPage.locDescriptionSection).toBeVisible();
    await expect.soft(mainPage.locTextArea).toBeVisible();
    await expect.soft(mainPage.locOptJson).toBeVisible();
    await expect.soft(mainPage.locOptJson).toBeChecked();
    await expect.soft(mainPage.locOptText).toBeVisible();
    await expect.soft(mainPage.locOptText).not.toBeChecked();
    await expect.soft(mainPage.locBttnSubmit).toBeVisible();

    await expect.soft(mainPage.locModalSpinner).not.toBeVisible();
    await expect.soft(mainPage.locErrorDiv).not.toBeVisible();
  });
});
