import type { Page } from "@playwright/test";

export default class BasePage {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async visit(url: string) {
    return await this.page.goto(url, { waitUntil: "load" });
  }

  public async getLocalStorageValue(name: string): Promise<string | null> {
    return await this.page.evaluate(
      ([name]) => {
        return window.localStorage.getItem(name);
      },
      [name],
    );
  }
}
