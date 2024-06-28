import { defineConfig } from "vite";
import { randomUUID } from "node:crypto";

export default defineConfig({
  html: {
    cspNonce: randomUUID(),
  },
});
