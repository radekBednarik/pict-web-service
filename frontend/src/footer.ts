import { waitForAttributeChange } from "./waiters.js";

export function injectFooter(element: HTMLDivElement) {
  element.innerHTML = `
    <div class="bg-primary-subtle rounded d-flex justify-content-end align-items-center p-2">
      <p class="mt-3 pt-3 pb-3">
        &copy <span id="copy-date"></span>
        <a href="https://github.com/radekBednarik" target="_blank" referrerpolicy="no-referrer">
          Radek Bednarik
        </a>
        |
        <a href="https://www.tesena.com/en" target="_blank" referrerpolicy="no-referrer">
          Tesena.com
        </a>
      </p>
      &nbsp
      |
      &nbsp
      <a 
        href="https://github.com/radekBednarik/pict-web-service" 
        class="link-underline link-underline-opacity-0 link-body-emphasis"
        target="_blank" referrerpolicy="no-referrer"
      >
        <div id="github-image-wrapper">
        </div>
      </a>
    </div>
  `;
}

function injectImage(element: HTMLDivElement, htmlElAttVal: string | null) {
  const imageEl = document.createElement("img");

  // set attributes
  imageEl.id = "github-logo";
  imageEl.crossOrigin = "anonymous";
  imageEl.decoding = "async";
  imageEl.fetchPriority = "low";
  imageEl.height = 25;
  imageEl.alt = "Link to this page Github repository.";

  switch (htmlElAttVal) {
    case null:
      imageEl.src = "./github-mark.png";
      break;
    default:
      imageEl.src = "./github-mark-white.png";
      break;
  }

  // remove element, if it was already rendered
  const potentialImgEl =
    element.querySelector<HTMLImageElement>("#github-logo");

  if (potentialImgEl) {
    potentialImgEl.remove();
  }
  // then append newly created to DOM
  element.appendChild(imageEl);
}

document.addEventListener("DOMContentLoaded", () => {
  const htmlEl = document.querySelector<HTMLElement>("html");
  const imageWrapper = document.getElementById(
    "github-image-wrapper",
  ) as HTMLDivElement;

  // append specific image after elements are rendered
  if (imageWrapper) {
    waitForAttributeChange(htmlEl!, "data-bs-theme")
      .then((value) => {
        injectImage(imageWrapper, value);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  const switchThemeEl = document.getElementById(
    "switch-theme",
  ) as HTMLInputElement;

  // handle loading correct image when theme is changed
  switchThemeEl!.addEventListener("click", () => {
    waitForAttributeChange(htmlEl!, "data-bs-theme")
      .then((value) => {
        injectImage(imageWrapper, value);
      })
      .catch((err) => {
        console.error(err.message);
      });
  });

  // add current year on load
  injectCopyDate();
});

// injects current year for copy date
function injectCopyDate() {
  const el = document.querySelector<HTMLSpanElement>("#copy-date");
  const year = new Date().getFullYear();

  el!.innerText = String(year);
}
