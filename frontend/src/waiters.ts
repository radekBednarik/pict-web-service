export function waitForAttributeChange(
  element: HTMLElement,
  attributeName: string,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    // Create a MutationObserver to watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === attributeName
        ) {
          if (
            element.hasAttribute(attributeName) ||
            !element.hasAttribute(attributeName)
          ) {
            observer.disconnect();
            resolve(element.getAttribute(attributeName));
          }
        }
      }
    });

    // Start observing the element for attribute changes
    observer.observe(element, { attributes: true });

    // Optional: Set a timeout to avoid waiting indefinitely
    setTimeout(() => {
      observer.disconnect();
      reject(
        new Error(
          `Timeout waiting for attribute '${attributeName}' to be either present or not present`,
        ),
      );
    }, 2000); // Adjust the timeout duration as needed
  });
}
