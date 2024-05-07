import "./scss/styles.scss";
import * as boot from "bootstrap";

import { injectForm } from "./form.js";
import { injectDescription } from "./description.js";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <div class="row mb-3">
      <div class="col" id="description">

      </div>

    </div>
    <div class="row">
      <div class="col" id="form">
      </div>
    </div> 
  </div>
  `;

injectDescription(document.querySelector("#description")!);
injectForm(document.querySelector("#form")!);
