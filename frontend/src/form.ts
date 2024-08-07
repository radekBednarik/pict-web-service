import download from "downloadjs";
import { Modal } from "bootstrap";

import { injectSpinnerModal } from "./spinner-modal";

export function injectForm(element: HTMLDivElement) {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
  const endpoint = `${baseUrl}/generate`;
  const textAreaValue =
    '# This is an example of the PICT model input\n\
# that will generate tests for pair-wise combinations\n\
# of parameters \'OS\', \'Browser\' and \'Viewport\'.\n\
# \n\
# Just click Generate button and browser will automatically\n\
# download the file with generated tests\n\
# \n\
OS: Windows 11, Windows 10, Linux, macOS\n\
Browser: Chrome, Edge, Firefox, Safari\n\
Viewport: desktop, mobile\n\
\n\
IF [OS] = "macOS" THEN [Browser] = "Safari";\n\
IF [OS] <> "macOS" THEN [Browser] <> "Safari";';

  element.innerHTML = `
    <div id="spinner-modal-wrapper">
    </div>

    <form 
      id="data-input-form" 
      name="data-input-form" 
      method="post" 
      enctype="application/x-www-form-urlencoded" 
      action=${endpoint}
    >
      <div class="mb-3">
        <label for="data" 
          class="form-label" 
          >
            <b>Fill in the PICT model specification:</b>
        </label>
        <textarea id="data" name="data" rows="15" cols="70"
          placeholder="PICT model text goes here..." 
          autofocus="false"
          form="data-input-form"
          required="true"
          class="form-control"
          aria-describedby="ModelInput"
        >${textAreaValue}</textarea>
      </div>

      <div class="container">
        <div class="row justify-content-between align-items-start">
          <div class="col">
            <div id="output-select-wrapper">
              <label for="output">Select output file type:</label>
              <select
                class="form-select mt-2"
                id="output"
                name="output"
                form="data-input-form"
                aria-label="Output type select."
              >
                <option value="txt" selected>Text (.txt)</option>
                <option value="json">JSON (.json)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="xlsx">XLSX (.xlsx)</option>
              </select>
            </div>
          </div>

          <div class="col">
            <label for="right-side-input-group">Other options:</label>
            <div id="right-side-input-group" class="input-group mt-2">
              <span class="input-group-text" id="comb-order-desc">
                <a
                  href="https://github.com/microsoft/pict/blob/main/doc/pict.md#usage"
                  target="_blank"
                  referrerpolicy="noreferrer"
                >
                  Combinatorial order:
                </a>
              </span>
              <input 
                id="comb-order"
                name="combOrder"
                type="number" 
                class="form-control" 
                placeholder="Default value is 2" 
                value=2
                min=1
                aria-label="Combinatorial order" 
                aria-describedby="comb-order-desc"/>
            </div>
            <div class="input-group mt-2">
              <span class="input-group-text" id="seed-file-desc">Provide &nbsp
                <a href="https://github.com/microsoft/pict/blob/main/doc/pict.md#seeding" target="_blank" referrerpolicy="noreferrer">
                  seed file
                </a>
                , if needed:
              </span>
              <input 
                id="seed-file"
                name="seedFile"
                type="file"
                accept=".txt"
                class="form-control"
                placeholder="Select seed file"
                aria-label="Seed file"
                aria-describedby="seed-file"
              />
            </div>
          </div>

        </div>
      </div>

      <hr/>

      <div class="mb-3">
        <label for="bttn-generate" class="form-label">
          Click to generate and download data:
        </label>
        <button 
          id="bttn-generate" 
          type="submit" 
          class="btn btn-primary" 
        >
          Generate
        </button>
      </div>

    </form>

    <div id="form-error-message" style="display:none" class="alert alert-warning" role="alert"></div>
  `;

  // inject hidden modal element containing spinner
  const modalWrapper = element.querySelector(
    "#spinner-modal-wrapper",
  ) as HTMLDivElement;
  injectSpinnerModal(modalWrapper!);

  // handle sending form data and downloading results
  const form = element.querySelector<HTMLFormElement>("#data-input-form");
  const submitButton =
    element.querySelector<HTMLButtonElement>("#bttn-generate");
  const seedFile = document.getElementById("seed-file") as HTMLInputElement;

  let modal = new Modal("#spinner-modal");

  // handle the form submit
  form!.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
    submitButton!.disabled = true;

    // display modal with spinner if one second or longer
    const spinnerTimeout = setTimeout(() => {
      modal.show();
    }, 1000);

    // @ts-expect-error
    const encodedData = new URLSearchParams(new FormData(form!));
    const seedFileContent = await seedFile!.files?.item(0)?.text();
    encodedData.set("seedFile", seedFileContent ? seedFileContent : "");

    try {
      const response = await fetch(form!.action, {
        method: "POST",
        body: encodedData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        clearTimeout(spinnerTimeout);
        throw new Error("Something went wrong.");
      }

      clearTimeout(spinnerTimeout);

      // since we are handling fetching data ourselves
      // we have to manually trigger the download of the file
      // browser will not do it
      const outTypes = document.getElementById("output") as HTMLSelectElement;
      const options = outTypes!.options;

      for (const option of options) {
        if (option.selected === true) {
          download(
            await response.blob(),
            `downloaded-data.${option.value}`,
            option.value === "json" ? "application/json" : "text/plain",
          );
          break;
        }
      }
    } catch (error) {
      // display error message element
      const errMsg = document.getElementById("form-error-message");
      errMsg!.textContent = `${error}`;
      errMsg!.style.display = "block";
    } finally {
      modal.hide();
      submitButton!.disabled = false;
    }
  });

  // handle hiding the error message if it is visible and new attempt
  // to generate by clicking the button is made

  const button = element.querySelector<HTMLButtonElement>("#bttn-generate");

  button!.addEventListener("click", () => {
    const errMsg = document.getElementById("form-error-message");

    if (errMsg!.style.display !== "none") {
      errMsg!.style.display = "none";
    }
  });
}
