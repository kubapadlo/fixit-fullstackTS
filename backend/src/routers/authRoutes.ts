import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { userLoginValidationSchema, userRegisterValidationSchema } from "../models/user.model"

export const createAuthRouter = (authController: AuthController) => {
  const authRouter = Router();

  authRouter.post("/register", validate(userRegisterValidationSchema), authController.register);
  authRouter.post("/login", validate(userLoginValidationSchema), authController.login);
  authRouter.get("/refreshtoken", authController.refreshToken);
  authRouter.get("/logout", authController.logout);

  return authRouter;
};