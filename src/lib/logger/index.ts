import pino from "pino";

const isDevelopment = (process.env.NODE_ENV || "development") !== "development";

export const logger = pino(
  isDevelopment ? { level: "trace" } : { level: "info" },
  pino.transport({ target: "pino-pretty" })
);
