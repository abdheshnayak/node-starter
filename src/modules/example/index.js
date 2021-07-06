import { Router } from "express";
import exampleRouter from "./routers";

const router = Router();
router.use("/example", exampleRouter);

const exampleModule = {
  init: (app) => {
    app.use(router);
    console.log("Example module loaded");
  },
};

export default exampleModule;
