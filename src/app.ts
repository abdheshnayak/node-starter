import "./config/passport";

import path from "node:path";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { NextFunction } from "express";
import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import passport from "passport";

import { getEnv } from "./config/load-env";
import { useJwt } from "./config/passport";
import { _dirname } from "./lib/node-utils";


export const createApp = () => {
  useJwt(passport);
  const app = express();
  app.use(express.json());

  app.use(cookieParser());

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    const allowedOrigins = [
      "http://localhost:3000",
      new RegExp(getEnv().CORS_REGEX),
    ];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return next();
  });

  app.use(express.static(path.join(_dirname(import.meta.url), "public")));
  app.use(express.static(_dirname(import.meta.url) + "/public"));
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp",
    })
  );
  return app;
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(
    createError(StatusCodes.NOT_FOUND, `${req.originalUrl} route not found`)
  );
};

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  res.status(err.statusCode || 500).send({
    msg: "something unwanted occured....",
    error: err.message,
  });
};

export const finishApp = (app: express.Application) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};
