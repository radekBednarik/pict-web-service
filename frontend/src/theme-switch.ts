export function injectThemeSwitch(element: HTMLDivElement) {
  element.innerHTML = `
    <div class="d-flex justify-content-end">
      <div class="form-check form-switch">
        <input class="form-check-input mt-2" type="checkbox" role="switch" id="switch-theme">
        <label class="form-check-label ml-1 fw-lighter" for="switch-theme">Dark theme</label>
      </div>
    </div>
  `;

  // switch Theme
  document.addEventListener("DOMContentLoaded", () => {
    const switchTheme =
      element.querySelector<HTMLInputElement>("#switch-theme")!;
    const html = document.querySelector<HTMLElement>("html")!;

    setThemeOnLoad(html, switchTheme);

    switchTheme.addEventListener("click", () => {
      setThemeOnClick(html, switchTheme);
    });
  });
}

function setThemeOnLoad(htmlEl: HTMLElement, themeSwitch: HTMLInputElement) {
  const themeValue = window.localStorage.getItem("theme");

  if (themeValue && themeValue === "dark") {
    htmlEl.setAttribute("data-bs-theme", "dark");
    themeSwitch.checked = true;
  } else {
    htmlEl.removeAttribute("data-bs-theme");
    themeSwitch.checked = false;
  }
}

function setThemeOnClick(htmlEl: HTMLElement, themeSwitch: HTMLInputElement) {
  const themeValue = window.localStorage.getItem("theme");

  if (!themeValue || themeValue === "light") {
    htmlEl.setAttribute("data-bs-theme", "dark");
    window.localStorage.setItem("theme", "dark");
    themeSwitch.checked = true;
  } else {
    htmlEl.removeAttribute("data-bs-theme");
    window.localStorage.setItem("theme", "light");
    themeSwitch.checked = false;
  }
}
