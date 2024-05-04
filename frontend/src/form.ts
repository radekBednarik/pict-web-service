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
          autofocus="true"
          form="data-input-form"
          required="true"
          class="form-control"
          aria-describedby="ModelInput"
        ></textarea>
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

  const form = element.querySelector<HTMLFormElement>("#data-input-form");

  // handle req and resp
  form!.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    const data = new FormData(form!);
    const encodedData = new URLSearchParams(data);

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

      // window.location.href = "/";
    } catch (error) {
      // display error message element
      const errMsg = document.getElementById("form-error-message");
      errMsg!.textContent = `Error: ${error}`;
      errMsg!.style.display = "block";
    }
  });
}
