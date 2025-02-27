import { Router } from "express";
import { Express } from "express";

import { logger } from "~/lib/logger";

import authRouter from "./router";

const router = Router();

router.use("/auth", authRouter);

const authModule = {
  init: (app: Express) => {
    app.use(router);
    logger.info("Auth module loaded");
  },
};

export default authModule;
