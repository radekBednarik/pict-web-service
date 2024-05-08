import "./scss/styles.scss";

import { injectForm } from "./form.js";
import { injectDescription } from "./description.js";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <div class="row">
      <div class="col mb-4" id="main-heading">
        <h1>
          Pair-wise Test Generator
        </h1>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col" id="description">
      </div>
    </div>
    <div class="row">
      <div class="col" id="form">
      </div>
    </div> 
  </div>
  `;

injectForm(document.querySelector("#form")!);
injectDescription(document.querySelector("#description")!);
