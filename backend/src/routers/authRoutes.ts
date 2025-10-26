import { Router } from "express";
import  {register,login}  from "../controllers/authController";

// @ts-ignore
import {validate} from "../middleware/validate.js"
import { userLoginValidationSchema, userRegisterValidationSchema } from "../models/user.model";

const authRouter = Router();

authRouter.post("/register", validate(userRegisterValidationSchema), register);
authRouter.post("/login", validate(userLoginValidationSchema), login);

export default authRouter;
