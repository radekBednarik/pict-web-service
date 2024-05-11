export function injectFooter(element: HTMLDivElement) {
  element.innerHTML = `
    <div class="bg-primary-subtle rounded">
      <p class="mt-3 pt-3 pb-3 text-primary text-end">
        &copy 2024 Radek Bednarik &nbsp
      </p>
    </div>
  `;
}
