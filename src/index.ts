import { createApp, finishApp } from "./app";
import { getEnv } from "./config/load-env";
import { logger } from "./lib/logger";
import authModule from "./modules/auth";
import { connect } from "./modules/db/connection";
import exampleModule from "./modules/example";

await connect();

const app = createApp();

app.get("/healthy", (req, res) => {
  res.sendStatus(200);
});

authModule.init(app);
exampleModule.init(app);
finishApp(app);

const port = getEnv().PORT;

(async () => {
  try {
    app.listen(port);
    logger.info("------Server Started------");
    logger.info(`server started on port ${port}`);
  } catch (err) {
    logger.error((err as Error).message);
    process.exit(1);
  }
})();
