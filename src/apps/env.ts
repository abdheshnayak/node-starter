import { validateEnv } from "~/lib/env";
import yup from "~/lib/yup";

export const loadEnv = () => {
  return validateEnv(yup.object({
    NODE_ENV: yup.string().oneOf(["development", "production"]),
  }));
};
