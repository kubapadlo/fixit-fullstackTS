import { Router } from "express";

import { addFault, showFaults, upload } from "../controllers/userController";

import { newFaultSchema } from "../models/flaw.model";
// @ts-ignore
import {validate} from "../middleware/validate.js"
// @ts-ignore
import {verifyRole} from "../middleware/verifyRole.js"
// @ts-ignore
import {verifyJWT} from "../middleware/verifyJWT.js"
// @ts-ignore
import {multerErrorHandler} from "../middleware/multerErrorHandler.js"

const userRouter = Router();

userRouter.post("/addFault", verifyJWT, verifyRole("student"), upload, multerErrorHandler, validate(newFaultSchema), addFault);
userRouter.get("/showFaults", verifyJWT, showFaults);

export default userRouter;
