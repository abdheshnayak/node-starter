import adminModel from "../model";
import assert from "assert";
import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { readSecret } from "../../../config/read-secret";

const keys = {
  mongoURL: readSecret("DB_URL"),
  secretKey: readSecret("SECRET_KEY"),
};

const getSignedToken = ({ payload, key }) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, key, { expiresIn: 3600 }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });

const authServices = {};

authServices.doLogin = async ({ email, password }) => {
  assert(
    email !== null && password != null,
    createError(StatusCodes.BAD_REQUEST, "Required email & Password")
  );
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
};

authServices.doRegister = async ({ name, email, password, user }) => {
  assert(
    name && email && password,
    createError(StatusCodes.FORBIDDEN, "provide all required values")
  );

  assert(user.is_admin, createError(StatusCodes.FORBIDDEN, "Access Denied"));

  const record = await adminModel.findOne({ email: email });
  assert(record === null, createError(StatusCodes.BAD_REQUEST, "user exists"));
  const hashPassword = md5(password);
  const result = await adminModel.create({
    email,
    name,
    password: hashPassword,
  });
  return result;
};

authServices.doSuperRegister = async (data) => {
  const hashPassword = md5(data.password);
  const casedEmail = data["email"].toLowerCase();
  const result = await adminModel.create({
    ...data,
    password: hashPassword,
    email: casedEmail,
    is_admin: true,
  });
  return result;
};

authServices.getAllUser = async (user) => {
  assert(user.is_admin, createError(StatusCodes.FORBIDDEN, "Access Denied"));
  const response = await adminModel.find({}, { password: 0 });
  return response;
};

authServices.getAUser = async ({ id, user }) => {
  assert(user.is_admin, createError(StatusCodes.FORBIDDEN, "Access Denied"));
  const response = await adminModel.findById(id);
  return response;
};

authServices.updateUser = async ({ id, data }) =>
  await adminModel.findByIdAndUpdate(id, data);

authServices.changePassword = async ({ old_password, new_password, email }) => {
  assert(
    new_password !== old_password,
    createError(
      StatusCodes.BAD_REQUEST,
      "New password can't be same as old password"
    )
  );
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
};

authServices.doResetPassword = async ({ email, new_password }) => {
  const record = adminModel.findOne({ email });
  assert(
    record !== null,
    createError(StatusCodes.BAD_REQUEST, "User does not exist")
  );
  return adminModel.findOneAndUpdate(
    { email },
    { password: md5(new_password) }
  );
};

authServices.deleteAllUserDev = async ({ user }) => {
  await adminModel.deleteMany({});
};

authServices.deleteUser = async ({ id, user }) => {
  assert(user.is_admin, createError(StatusCodes.FORBIDDEN, "Access Denied"));
  await adminModel.findByIdAndDelete(id);
};

export default authServices;
