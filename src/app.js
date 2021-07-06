import express from "express";
import bodyParser from "body-parser";
import createError from "http-errors-lite";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import { readSecret } from "./config/read-secret";
import fileUpload from "express-fileupload";
import path from "path";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    const allowedOrigins = [
      "http://localhost:3000",
      // "https://yourendpoint.com",
      new RegExp(readSecret("CORS_REGEX")),
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    return next();
  });

  app.use(express.static(__dirname + "/public"));
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: path.join(__dirname, "tmp"),
    })
  );
  return app;
};

export const notFoundHandler = (req, res, next) => {
  next(
    createError(StatusCodes.NOT_FOUND, `${req.originalUrl} route not found`)
  );
};

export const errorHandler = (err, req, res, _next) => {
  res.status(err.statusCode || 500).send({
    msg: "something unwanted occured....",
    error: err.message,
  });
};

export const finishApp = (app) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};
