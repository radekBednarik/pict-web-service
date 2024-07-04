import { Collapse } from "bootstrap";

export function injectDescription(element: HTMLDivElement) {
  element.innerHTML = `
    <div class="accordion" id="desc-group">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            How does this tool work?
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#desc-group"
        >
          <div class="accordion-body">
            This tool is using
            <a
              href="https://github.com/microsoft/pict"
              target="_blank"
              referrerpolicy="no-referrer-when-downgrade"
            >
              PICT
            </a>
            under the hood. It is an open-source program developed by Microsoft,
            which enables to easily generate test cases in line with pair-wise
            testing strategy.<br />
            Please 
            <a
              href="https://github.com/microsoft/pict/blob/main/doc/pict.md"
              target="_blank"
              referrerpolicy="no-referrer-when-downgrade"
              alt="Link to PICT Github repository readme file."
            >
            read detailed documentation
            </a>
            regarding how to write the input
            model for the PICT.
            <hr>
            <div class="d-flex justify-content-start mt-2">
              <button 
                id="copy" 
                type="button" 
                class="btn btn-sm btn-outline-primary mb-2"
              >
                Try this! 
              </button>
            </div>
            <div>
              <pre id="pict-input-example">
OS: Windows 11, Windows 10, Linux, macOS
Browser: Chrome, Edge, Firefox, Safari
Viewport: desktop, mobile

IF [OS] = "macOS" THEN [Browser] = "Safari";
IF [OS] <> "macOS" THEN [Browser] <> "Safari";
              </pre>
            </div>
          </div>
        </div>
      </div>
     </div>
    `;

  // enable collapsing of accordion items
  document.addEventListener("DOMContentLoaded", () => {
    const collapseElementList = document.querySelectorAll(".collapse");
    [...collapseElementList].map(
      (collapseEl) => new Collapse(collapseEl, { toggle: false }),
    );
  });

  // enable copying
  document.getElementById("copy")!.addEventListener("click", async () => {
    const exampleInputEl = document.getElementById(
      "pict-input-example",
    ) as HTMLPreElement;
    const formDataInputEl = document.getElementById(
      "data",
    ) as HTMLTextAreaElement;

    try {
      await navigator.clipboard.writeText(exampleInputEl.textContent!.trim());
      formDataInputEl!.value = await navigator.clipboard.readText();
    } catch (error) {
      console.error(`Unable to copy text. ${error}`);
    }
  });
}
