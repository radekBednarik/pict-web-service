import type { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export default class MainPage extends BasePage {
  public readonly locHtml: Locator;
  public readonly locBttnThemeSwitch: Locator;
  public readonly locMainHeading: Locator;
  public readonly locDescriptionSection: Locator;
  public readonly locBttnCopy: Locator;
  public readonly locBttnDescExample: Locator;
  public readonly locExampleModel: Locator;
  public readonly locTextArea: Locator;
  public readonly locOutSelect: Locator;
  public readonly locBttnSubmit: Locator;
  public readonly locErrorDiv: Locator;
  public readonly locModalSpinner: Locator;

  public readonly url: string;

  constructor(page: Page) {
    super(page);

    this.url = "/";

    this.locHtml = this.page.locator("html");
    this.locBttnThemeSwitch = this.page.getByTestId("switch-theme");
    this.locMainHeading = this.page.getByTestId("main-heading");
    this.locDescriptionSection = this.page.getByTestId("description");
    this.locBttnDescExample = this.page.getByTestId("accordion-example-button");
    this.locExampleModel = this.page.getByTestId("pict-input-example");
    this.locBttnCopy = this.page.getByTestId("copy");
    this.locTextArea = this.page.getByTestId("data");
    this.locOutSelect = this.page.getByTestId("output");
    this.locBttnSubmit = this.page.getByTestId("bttn-generate");
    this.locErrorDiv = this.page.getByTestId("form-error-message");
    this.locModalSpinner = this.page.getByTestId("spinner-modal");
  }

  public async visit() {
    return super.visit(this.url);
  }
}
