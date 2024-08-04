import { defineConfig } from "vite";
import { randomUUID } from "node:crypto";
import { setCSP } from "./utils/headers";

export default defineConfig({
  html: {
    cspNonce: randomUUID(),
  },
  server: {
    headers: {
      "content-security-policy": setCSP(),
      "x-frame-options": "DENY",
      "strict-transport-security":
        "max-age=63072000; includeSubDomains; preload",
    },
  },
});
