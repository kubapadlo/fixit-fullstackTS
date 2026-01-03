import { Router } from "express";
import  {register,login, refreshToken, logout}  from "../controllers/authController";

// @ts-ignore
import {validate} from "../middleware/validate.js"
// @ts-ignore
import {verifyRole} from "../middleware/verifyRole.js"

import { userLoginValidationSchema, userRegisterValidationSchema } from "../models/user.model";

const authRouter = Router();

authRouter.post("/register", validate(userRegisterValidationSchema), register);
authRouter.post("/login", validate(userLoginValidationSchema), login);
authRouter.get("/refreshtoken", refreshToken);
authRouter.get("/logout", logout)

export default authRouter;
