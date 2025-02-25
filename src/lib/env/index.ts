import yup from "../yup";

export const validateEnv = <T,>(schema: yup.Schema<T>) => {
  const env = process.env;

  return schema.validateSync(env, { stripUnknown: true }) as yup.Asserts<typeof schema>;
}; 
