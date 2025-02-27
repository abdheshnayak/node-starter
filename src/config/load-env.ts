import { EnvType, validateEnv } from "~/lib/env";
import yup from "~/lib/yup";

const envSchema = yup.object({
  PORT: yup.number().default(3000),
  MONGODB_URI: yup.string().required(),
  NODE_ENV: yup.string().oneOf(["development", "production"]).default("development"),
  CORS_REGEX: yup.string().default("http://localhost:3000"),
  SECRET_KEY: yup.string().required(),
});

let env: EnvType<typeof envSchema>;

export const getEnv = () => {
  if (!env) {
    env = validateEnv(envSchema);
  }
  return env;
};
