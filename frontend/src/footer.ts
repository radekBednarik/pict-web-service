export function injectFooter(element: HTMLDivElement) {
  element.innerHTML = `
    <div class="d-flex justify-content-end align-items-center">
      <p class="mt-3">
        &copy 2024 Radek Bednarik
      </p>
    </div>
  `;
}
