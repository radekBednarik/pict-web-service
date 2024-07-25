export function setCSPValue() {
  if (!process.env.CI) {
    return "default-src 'self' localhost:4000 pict-web-service-backend.onrender.com www.clarity.ms 'unsafe-inline'; img-src * data:;";
  }

  return "default-src 'self' pict-web-service-backend.onrender.com www.clarity.ms 'unsafe-inline'; img-src * data:;";
}
