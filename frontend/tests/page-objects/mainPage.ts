import type { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export default class MainPage extends BasePage {
  public readonly locMainHeading: Locator;
  public readonly locDescriptionSection: Locator;
  public readonly locTextArea: Locator;
  public readonly locOptJson: Locator;
  public readonly locOptText: Locator;
  public readonly locBttnSubmit: Locator;
  public readonly locErrorDiv: Locator;
  public readonly locModalSpinner: Locator;

  public readonly url: string;

  constructor(page: Page) {
    super(page);

    this.url = "/";

    this.locMainHeading = this.page.getByTestId("main-heading");
    this.locDescriptionSection = this.page.getByTestId("description");
    this.locTextArea = this.page.getByTestId("data");
    this.locOptJson = this.page.getByTestId("optJson");
    this.locOptText = this.page.getByTestId("optText");
    this.locBttnSubmit = this.page.getByTestId("bttn-generate");
    this.locErrorDiv = this.page.getByTestId("form-error-message");
    this.locModalSpinner = this.page.getByTestId("spinner-modal");
  }

  public async visit() {
    return super.visit(this.url);
  }
}
