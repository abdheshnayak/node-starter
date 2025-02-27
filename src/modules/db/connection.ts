import mongoose from "mongoose";

import { getEnv } from "~/config/load-env";
import { logger } from "~/lib/logger";

export const connect = async () => {
  const dbUrl = getEnv().MONGODB_URI;
  logger.info("Establishing db connection");
  await mongoose.connect(dbUrl, {
    dbName: "sample",
  });
  logger.info("Database connected successfully");
};
