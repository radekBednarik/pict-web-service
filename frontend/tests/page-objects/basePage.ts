import type { Page } from "@playwright/test";

export default class BasePage {
  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async visit(url: string) {
    return await this.page.goto(url, { waitUntil: "load" });
  }
}
