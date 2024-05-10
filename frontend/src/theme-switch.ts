export function injectThemeSwitch(element: HTMLDivElement) {
  element.innerHTML = `
    <div class="d-flex justify-content-end">
      <button type="button" id="switch-theme" class="btn btn-outline-primary">Switch Theme</button>
    </div>
  `;

  // switch Theme
  document.addEventListener("DOMContentLoaded", () => {
    const bttn = element.querySelector<HTMLButtonElement>("#switch-theme")!;
    const html = document.querySelector("html")!;

    setThemeOnLoad(html);

    bttn.addEventListener("click", () => {
      setThemeOnClick(html);
    });
  });
}

function setThemeOnLoad(htmlEl: HTMLElement) {
  const themeValue = window.localStorage.getItem("theme");

  if (!themeValue || themeValue === "light") {
    htmlEl.setAttribute("data-bs-theme", "");
  } else {
    htmlEl.setAttribute("data-bs-theme", "dark");
  }
}

function setThemeOnClick(htmlEl: HTMLElement) {
  const themeValue = window.localStorage.getItem("theme");

  if (!themeValue || themeValue === "light") {
    htmlEl.setAttribute("data-bs-theme", "dark");
    window.localStorage.setItem("theme", "dark");
  } else {
    htmlEl.setAttribute("data-bs-theme", "");
    window.localStorage.setItem("theme", "light");
  }
}
