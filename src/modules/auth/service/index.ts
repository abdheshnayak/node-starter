import assert from "assert";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import md5 from "md5";

import { getEnv } from "~/config/load-env";
import yup, { validateParams } from "~/lib/yup";

import adminModel, { authedUser, defaultAdminSchema } from "../model";

const keys = {
  mongoURL: getEnv().MONGODB_URI,
  secretKey: getEnv().SECRET_KEY,
};

const getSignedToken = ({ payload, key }: {
  payload: any,
  key: string
}) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, key, { expiresIn: 3600 }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });


const doLogin = validateParams(yup.object({
  email: yup.string().email().lowercase().required(),
  password: yup.string().required(),
}), async ({ email, password }) => {

  const admin = await adminModel.findOne({
    email: email,
    password: md5(password),
  });

  assert(admin != null, createError(StatusCodes.UNAUTHORIZED, "Access denied"));

  const payload = {
    email: admin.email,
    is_admin: admin.is_admin,
    name: admin.name,
  };
  const token = await getSignedToken({ payload, key: keys.secretKey });
  return { ...payload, token: token };
});

const doRegister = validateParams(yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  user: authedUser,
}), async ({ name, email, password }) => {
  const record = await adminModel.findOne({ email: email });

  assert(record === null, createError(StatusCodes.BAD_REQUEST, "user exists"));

  const hashPassword = md5(password);
  const result = await adminModel.create({
    email,
    name,
    password: hashPassword,
  });
  return result;
});

const doSuperRegister = validateParams(defaultAdminSchema, async (data) => {
  const { password, email } = data;

  const hashPassword = md5(password);
  const casedEmail = email.toLowerCase();

  const result = await adminModel.create({
    ...data,
    password: hashPassword,
    email: casedEmail,
    is_admin: true,
  });

  result.password = undefined;

  return result;
});

const getAllUser = validateParams(authedUser, async (_user) => {
  const response = await adminModel.find({}, { password: 0 });
  return response;
});

const getAUser = validateParams(yup.object({
  id: yup.string().required(),
  user: authedUser,
}), async ({ id }) => {
  const response = await adminModel.findById(id);
  return response;
});

const updateUser = validateParams(yup.object({
  id: yup.string().required(),
  data: yup.object({
    name: yup.string().default(undefined),
    email: yup.string().email().default(undefined),
  }),
}), async ({ id, data }) =>
  await adminModel.findByIdAndUpdate(id, data)
);

const changePassword = validateParams(yup.object({
  old_password: yup.string().required(),
  new_password: yup.string()
    .required("New password is required")
    .notOneOf([yup.ref("old_password")], "New password must be different from old password"),
  email: yup.string().email().required(),
}), async ({ old_password, new_password, email }) => {

  const user = await adminModel.findOne({
    email: email,
    password: md5(old_password),
  });

  assert(user, createError(StatusCodes.BAD_REQUEST, "Password didn't matched"));

  const hashed_password = md5(new_password);
  await adminModel.findOneAndUpdate(
    { email: email },
    { password: hashed_password }
  );
});

const doResetPassword = validateParams(yup.object({
  email: yup.string().email().required(),
  new_password: yup.string().required(),
}), async ({ email, new_password }) => {
  const record = adminModel.findOne({ email });

  assert(
    record !== null,
    createError(StatusCodes.BAD_REQUEST, "User does not exist")
  );

  return adminModel.findOneAndUpdate(
    { email },
    { password: md5(new_password) }
  );
});

const deleteAllUserDev = async () => {
  await adminModel.deleteMany({});
};

const deleteUser = validateParams(yup.object({
  id: yup.string().required(),
  user: authedUser,
}), async ({ id, user }) => {
  assert(user.is_admin, createError(StatusCodes.FORBIDDEN, "Access Denied"));

  await adminModel.findByIdAndDelete(id);
});

const authServices = {
  doLogin,
  doRegister,
  doSuperRegister,
  getAllUser,
  getAUser,
  updateUser,
  changePassword,
  doResetPassword,
  deleteAllUserDev,
  deleteUser,
};

export default authServices;

