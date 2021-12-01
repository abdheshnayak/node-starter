import { finishApp, createApp } from "./app";

import { readSecret } from "./config/read-secret";
import exampleModule from "./modules/example";

const app = createApp();

app.get("/healthy", (req, res) => {
  res.sendStatus(200);
});

exampleModule.init(app);
finishApp(app);

const port = Number(readSecret("PORT"));

(async () => {
  try {
    await app.listen(port);
    console.log("------Server Started------");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
})();
