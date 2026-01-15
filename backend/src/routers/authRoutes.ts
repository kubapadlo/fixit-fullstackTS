import { Router } from "express";
import { AuthController } from "../controllers/authController"

// middleware
import {validate} from "../middleware/validate"

import { userLoginValidationSchema, userRegisterValidationSchema } from "../validators/user.model";

const authRouter = Router();

authRouter.post("/register", validate(userRegisterValidationSchema), AuthController.register);
authRouter.post("/login", validate(userLoginValidationSchema), AuthController.login);
authRouter.get("/refreshtoken", AuthController.refreshToken);
authRouter.get("/logout", AuthController.logout)

export default authRouter;
