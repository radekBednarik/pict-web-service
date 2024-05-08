export function injectSpinnerModal(element: HTMLDivElement) {
  element.innerHTML = `
    <div class="modal fade" id="spinner-modal" tabindex="-1" style="display:none">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Please wait until server provides data...</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body d-flex justify-content-center" id="spinner">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
