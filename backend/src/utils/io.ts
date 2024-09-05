import { rm } from "fs/promises";
import type { Logger } from "pino";

async function deleteFile(filepath: string, logger: Logger) {
  try {
    await rm(filepath, { retryDelay: 500, maxRetries: 3 });
  } catch (error) {
    logger.error({
      error: { code: 500, message: `File ${filepath} was not deleted due to error: ${error} ` },
    });
  }
}

export async function deleteFiles(logger: Logger, ...filepaths: (string | undefined)[]) {
  const promises = filepaths.map((path) => {
    if (typeof path === "string") {
      return deleteFile(path, logger);
    }

    return new Promise((res) => res);
  });

  await Promise.all(promises);
}
