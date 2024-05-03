import "./scss/styles.scss";
import * as boot from "bootstrap";

import { injectForm } from "./form.js";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <div class="row">
      <div class="col" id="form">
      </div>
    </div> 
  </div>
  `;

injectForm(document.querySelector("#form")!);
