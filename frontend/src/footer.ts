export function injectFooter(element: HTMLDivElement) {
  element.innerHTML = `
    <div class="bg-primary-subtle rounded d-flex justify-content-between align-items-center">
      <div id="github-image-wrapper">
      </div>
      <p class="mt-3 pt-3 pb-3">
        &copy 2024
        <a href="mailto:radek.bednarik@tesena.com">
          Radek Bednarik
        </a>
        |
        <a href="https://https://www.tesena.com/en" target="_blank" referrerpolicy="no-referrer">
          Tesena.com
        </a>
        &nbsp
      </p>
    </div>
  `;
}

function injectImage(element: HTMLDivElement) {
  console.log(element.tagName);
  const theme = window.localStorage.getItem("theme");
  const imageEl = document.createElement("img");

  // set attributes
  imageEl.id = "github-logo";
  imageEl.crossOrigin = "anonymous";
  imageEl.decoding = "async";
  imageEl.fetchPriority = "low";
  imageEl.height = 40;

  switch (theme) {
    case null:
      imageEl.src = "./github-mark.png";
      break;
    case "light":
      imageEl.src = "./github-mark.png";
      break;
    default:
      imageEl.src = "./github-mark-white.png";
      break;
  }

  // remove element, if it was already rendered
  const potentialImgEl =
    element.querySelector<HTMLImageElement>("#github-logo");
  if (potentialImgEl && element.contains(potentialImgEl)) {
    element.removeChild(imageEl);
  }
  // then append newly created to DOM
  element.appendChild(imageEl);
}

document.addEventListener("DOMContentLoaded", () => {
  // append specific image after elements are render
  injectImage(
    document.getElementById("github-image-wrapper") as HTMLDivElement,
  );

  // handle loading correct image when theme is changed
  document.getElementById("switch-theme")!.addEventListener("click", () => {
    injectImage(
      document.getElementById("github-image-wrapper") as HTMLDivElement,
    );
  });
});
