import { Router } from "express";
import  {register,login, refreshToken, logout}  from "../controllers/authController";

//middleware
import {validate} from "../middleware/validate"

import { userLoginValidationSchema, userRegisterValidationSchema } from "../models/user.model";

const authRouter = Router();

authRouter.post("/register", validate(userRegisterValidationSchema), register);
authRouter.post("/login", validate(userLoginValidationSchema), login);
authRouter.get("/refreshtoken", refreshToken);
authRouter.get("/logout", logout)

export default authRouter;
