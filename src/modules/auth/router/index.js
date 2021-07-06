import passport from "passport";
import { httpHandler } from "../../common/http-handler";
import authServices from "../service";
import { Router } from "express";
import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";
import assert from "assert";
const router = Router();

// Router for admin login
router.post(
  "/login",
  httpHandler(async (req, res) => {
    const { email, password } = req.body;
    const payload = await authServices.doLogin({
      email: email.toLowerCase(),
      password,
    });
    res.send(payload);
  })
);

// Router for register users
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const response = await authServices.doRegister({
      name,
      email: email.toLowerCase(),
      password,
      user: req.user,
    });
    res.send(response);
  })
);

// Router for register super admin
router.post(
  "/register-super-user",
  httpHandler(async (req, res) => {
    const data = req.body;
    const response = await authServices.doSuperRegister(data);
    res.send(response);
  })
);

// Router for getting current user
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req, res) => {
    res.json(req.user);
  })
);

// Router for getting all the users
router.get(
  "/get-all-users",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req, res) => {
    const data = await authServices.getAllUser(req.user);
    res.send(data);
  })
);

// Router for getting unique user
router.get(
  "/get-a-user/:id",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req, res) => {
    const id = req.params.id;
    const data = await authServices.getAUser({ id, user: req.user });
    res.send(data);
  })
);

// Router for updating user details
router.put(
  "/update-user",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req, res) => {
    assert(
      req.user.is_admin,
      createError(StatusCodes.FORBIDDEN, "Access Denied !")
    );
    const { id, data } = req.body;
    assert(!data.password, delete data.password);
    await authServices.updateUser({ id, data });
    res.send({
      message: "User successfully updated",
    });
  })
);

router.put(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req, res) => {
    const { email } = req.user;
    const { old_password, new_password } = req.body;
    await authServices.changePassword({ old_password, new_password, email });
    res.send({
      message: "password changed successfully",
    });
  })
);

router.put(
  "/reset-password",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req, res) => {
    assert(
      req.user.is_admin,
      createError(StatusCodes.UNAUTHORIZED, "access denied")
    );
    const { email, new_password } = req.body;
    const response = await authServices.doResetPassword({
      email,
      new_password,
    });
    res.send(response);
  })
);

// Router for deleting
router.delete(
  "/delete-user/:id",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req, res) => {
    const id = req.params.id;
    await authServices.deleteUser({ id, user: req.user });
    res.send({
      message: "User sucessfully deleted",
    });
  })
);

// Router for deleting all the users
router.delete(
  "/delete-all-user-dev",
  httpHandler(async (req, res) => {
    await authServices.deleteAllUserDev({ user: req.user });
    res.send({
      message: "All users sucessfully deleted",
    });
  })
);

export default router;
