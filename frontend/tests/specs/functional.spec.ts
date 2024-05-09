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
    test.beforeEach(async ({ page }) => {
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
