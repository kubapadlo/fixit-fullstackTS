import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { registerRequestSchema, loginRequestSchema } from "@fixit/shared";

export const createAuthRouter = (authController: AuthController) => {
  const authRouter = Router();

  authRouter.post("/register", validate(registerRequestSchema), authController.register);
  authRouter.post("/login", validate(loginRequestSchema), authController.login);
  authRouter.get("/refreshtoken", authController.refreshToken);
  authRouter.get("/logout", authController.logout);

  return authRouter;
};