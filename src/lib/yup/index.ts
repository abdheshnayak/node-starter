import { Request } from "express";
import * as yup from "yup";

import { logger } from "../logger";

export default yup;

export const validateRequest = <T,>(request: Request, schema: yup.Schema<T>) => {
  const { body } = request;
  try {
    const resp = schema.validateSync(body, {
      stripUnknown: true,
      abortEarly: false,
    });
    return resp as yup.Asserts<typeof schema>;
  } catch (err) {
    logger.error((err as yup.ValidationError).errors);
    throw Error((err as yup.ValidationError).errors.join(", "));
  }
};

export const validateParams = <T, T2>(schema: yup.Schema<T>, fn: (arg: T) => T2) => {
  return (arg: T) => {
    try {
      const resp = schema.validateSync(arg, {
        stripUnknown: true,
        abortEarly: false,
      });

      return fn(resp);

    } catch (err) {
      logger.error((err as yup.ValidationError).errors);
      throw Error((err as yup.ValidationError).errors.join(", "));
    }
  };
};

export const validateObject = <T>(schema: yup.Schema<T>, obj: any) => {
  try {
    const resp = schema.validateSync(obj, {
      stripUnknown: true,
      abortEarly: false,
    });

    return resp;
  } catch (err) {
    logger.error((err as yup.ValidationError).errors);
    throw Error((err as yup.ValidationError).errors.join(", "));
  }
};
