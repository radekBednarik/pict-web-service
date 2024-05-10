import "./scss/styles.scss";

import { injectThemeSwitch } from "./theme-switch.js";
import { injectForm } from "./form.js";
import { injectDescription } from "./description.js";
import { injectFooter } from "./footer.js";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <div class="row">
      <div class="col mb-4" id="main-heading">
        <h1>
          Pair-wise Test Generator
        </h1>
      </div>
      <div class="col-3 mb-4 mt-2" id="theme-switch">
      </div>
    </div>
    <div class="row mb-4">
      <div class="col" id="description">
      </div>
    </div>
    <div class="row mb-4">
      <div class="col" id="form">
      </div>
    </div> 
    <div class="row">
      <div class="col bg-primary-subtle rounded" id="footer">
      </div>
    </div>
  </div>
  `;

injectThemeSwitch(document.querySelector("#theme-switch")!);
injectForm(document.querySelector("#form")!);
injectDescription(document.querySelector("#description")!);
injectFooter(document.querySelector("#footer")!);
