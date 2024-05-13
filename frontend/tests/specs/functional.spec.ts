import { test, expect, Download } from "@playwright/test";
import MainPage from "../page-objects/mainPage";

import { mkdirSync, readFileSync } from "fs";
import path from "path";

const pictInput = readFileSync("tests/test-data/model-input-01.txt", {
  encoding: "utf-8",
});
const dirpath = "tests/test-data/temp/";

test.describe("functional", () => {
  let mainPage: MainPage;

  test.describe("happy scenarios", () => {
    test.beforeEach(async ({ page, context }) => {
      mainPage = new MainPage(page);

      await mainPage.visit();
    });

    test("output .json file is generated", async () => {
      await mainPage.locTextArea.clear();
      await mainPage.locTextArea.fill(pictInput);

      const downloadPromise = mainPage.page.waitForEvent("download");
      await mainPage.locBttnSubmit.click();
      const download = await downloadPromise;

      expect(await download.failure()).toBeNull();

      const fullpath = await saveDownloadedFile(dirpath, download);

      expect(path.extname(fullpath)).toBe(".json");
    });

    test("output .txt file is generated", async () => {
      await mainPage.locTextArea.clear();
      await mainPage.locTextArea.fill(pictInput);
      await mainPage.locOptText.check();

      const downloadPromise = mainPage.page.waitForEvent("download");
      await mainPage.locBttnSubmit.click();
      const download = await downloadPromise;

      expect(await download.failure()).toBeNull();

      const fullpath = await saveDownloadedFile(dirpath, download);

      expect(path.extname(fullpath)).toBe(".txt");
    });

    // skipped due to: https://github.com/microsoft/playwright/issues/8114
    test.skip("copy button works", async () => {
      await mainPage.locBttnDescExample.click();
      await mainPage.locExampleModel.waitFor({ state: "visible" });
      await mainPage.locBttnCopy.click();

      const clipContent = await mainPage.page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });

      expect(clipContent).not.toHaveLength(0);
    });

    test("light theme is set on open", async () => {
      await expect(mainPage.locBttnThemeSwitch).not.toBeChecked();
      await expect(mainPage.locHtml).not.toHaveAttribute("data-bs-theme");
      await expect(async () => {
        expect(await mainPage.getLocalStorageValue("theme")).toBe("light");
      }).toPass({ timeout: 5000, intervals: [500] });
    });
  });

  test.describe("unhappy scenarios", () => {
    test.use({ serviceWorkers: "block" });

    test.beforeEach(async ({ page }) => {
      mainPage = new MainPage(page);

      await mainPage.visit();
    });

    test("server returns after several seconds - spinner modal pops up", async () => {
      await mainPage.locTextArea.clear();
      await mainPage.locTextArea.fill(pictInput);

      // route POST endpoint to induce modal popup
      await mainPage.page.route("**/generate", async (route) => {
        await route.fetch();
        await mainPage.locModalSpinner.waitFor({ state: "visible" });
        await route.fulfill();
      });

      await mainPage.locBttnSubmit.click();

      await expect(async () => {
        await expect(mainPage.locModalSpinner).toBeVisible();
      }).toPass({ intervals: [500], timeout: 10000 });
    });

    test("server response fails with 500 - error div is displayed", async () => {
      await mainPage.locTextArea.clear();
      await mainPage.locTextArea.fill(pictInput);

      await mainPage.page.route("**/generate", async (route) => {
        await route.abort("timedout");
      });

      await mainPage.locBttnSubmit.click();

      await expect(mainPage.locErrorDiv).toBeVisible();
    });
  });
});

async function saveDownloadedFile(
  dirpath: string,
  download: Download,
): Promise<string> {
  mkdirSync(dirpath, { recursive: true });

  const filename = download.suggestedFilename();
  const fullpath = `${dirpath}${filename}`;

  await download.saveAs(fullpath);

  return fullpath;
}
