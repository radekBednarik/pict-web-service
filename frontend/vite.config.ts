import { defineConfig } from "vite";
import { randomUUID } from "node:crypto";

const nonce = randomUUID();

export default defineConfig({
  html: {
    cspNonce: nonce,
  },
  server: {
    headers: {
      "content-security-policy": `default-src 'self' localhost:4000 pict-web-service-backend.onrender.com www.clarity.ms 'unsafe-inline'; img-src * data:;`,
      "x-frame-options": "DENY",
      "strict-transport-security":
        "max-age=63072000; includeSubDomains; preload",
    },
  },
});
