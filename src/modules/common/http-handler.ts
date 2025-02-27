import { NextFunction, Request, Response } from "express";

export const httpHandler = (asyncFn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      try {
        await asyncFn(req, res, next);
      }
      catch (err) {
        next(err);
      }
    })();
  };
};
