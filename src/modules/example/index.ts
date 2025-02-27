import { Express, Router } from "express";

import { logger } from "~/lib/logger";

import exampleRouter from "./routers";

const router = Router();
router.use("/example", exampleRouter);

const exampleModule = {
  init: (app: Express) => {
    app.use(router);
    logger.info("Example module loaded");
  },
};

export default exampleModule;
