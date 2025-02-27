import { Router } from "express";
import { Request, Response } from "express";
import passport from "passport";

import yup, { validateObject, validateRequest } from "~/lib/yup";
import { httpHandler } from "~/modules/common/http-handler";

import { authedUser } from "../model";
import authServices from "../service";
const router = Router();

// Router for admin login
router.post(
  "/login",
  httpHandler(async (req: Request, res: Response) => {
    const payload = await authServices.doLogin(req.body);
    res.send(payload);
  })
);

// Router for register users
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const response = await authServices.doRegister({
      name,
      email: email.toLowerCase(),
      password,
      user: req.user as any,
    });
    res.send(response);
  })
);

// Router for register super admin
router.post(
  "/register-super-user",
  httpHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const response = await authServices.doSuperRegister(data);
    res.send(response);
  })
);

// Router for getting current user
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req: Request, res: Response) => {
    res.json(req.user);
  })
);

// Router for getting all the users
router.get(
  "/get-all-users",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req: Request, res: Response) => {
    const data = await authServices.getAllUser(req.user as any);
    res.send(data);
  })
);

// Router for getting unique user
router.get(
  "/get-a-user/:id",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await authServices.getAUser({ id, user: req.user as any });
    res.send(data);
  })
);

// Router for updating user details
router.put(
  "/update-user",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req: Request, res: Response) => {
    const { id, data } = validateRequest(req, yup.object({
      user: yup.object({
        is_admin: yup.boolean().isTrue("Access Denied"),
      }),
      data: yup.object({}),
      id: yup.string().required(),
    }));

    await authServices.updateUser({ id, data });
    res.send({
      message: "User successfully updated",
    });
  })
);

router.put(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  httpHandler(async (req: Request, res: Response) => {
    const { email } = validateObject(yup.object({
      email: yup.string().email().required(),
    }), req.user);

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
  httpHandler(async (req: Request, res: Response) => {
    validateObject(authedUser, req.user);


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
  httpHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await authServices.deleteUser({ id, user: req.user as any });
    res.send({
      message: "User sucessfully deleted",
    });
  })
);

// Router for deleting all the users
router.delete(
  "/delete-all-user-dev",
  httpHandler(async (req: Request, res: Response) => {
    await authServices.deleteAllUserDev();
    res.send({
      message: "All users sucessfully deleted",
    });
  })
);

export default router;
