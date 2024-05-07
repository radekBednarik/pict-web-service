import download from "downloadjs";

export function injectForm(element: HTMLDivElement) {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
  const endpoint = `${baseUrl}/generate`;

  element.innerHTML = `
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
            Fill in the PICT model specification:
        </label>
        <textarea id="data" name="data" rows="20" cols="70"
          placeholder="PICT model text goes here..." 
          autofocus="false"
          form="data-input-form"
          required="true"
          class="form-control"
          aria-describedby="ModelInput"
        ></textarea>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="output" id="optJson" value="json" checked />
        <label class="form-check-label" for="optJson">JSON (.json) output</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="output" id="optText" value="txt" />
        <label class="form-check-label" for="optText">Text (.txt) output</label>
      </div>
      <div class="mb-3">
        <label for="bttn-generate" class="form-label">
          Click to generate and download data:
        </label>
        <button id="bttn-generate" type="submit" class="btn btn-primary">Generate</button>

      </div>


    </form>

    <div id="form-error-message" style="display:none" class="alert alert-warning" role="alert"></div>
  `;

  // handle sending form data and downloading results
  const form = element.querySelector<HTMLFormElement>("#data-input-form");

  form!.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    // @ts-expect-error
    const encodedData = new URLSearchParams(new FormData(form!));

    try {
      const response = await fetch(form!.action, {
        method: "POST",
        body: encodedData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      // since we are handling fetching data ourselves
      // we have to manually trigger the download of the file
      // browser will not do it
      const outTypes = document.getElementsByName(
        "output",
      ) as NodeListOf<HTMLInputElement>;

      for (const item of outTypes) {
        if (item.checked === true) {
          download(
            await response.blob(),
            `downloaded-data.${item.value}`,
            item.value === "json" ? "application/json" : "text/plain",
          );
          break;
        }
      }
    } catch (error) {
      // display error message element
      const errMsg = document.getElementById("form-error-message");
      errMsg!.textContent = `${error}`;
      errMsg!.style.display = "block";
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
