import { Router } from "express";

import { addFault, showFaults } from "../controllers/userController";

import { newFaultSchema } from "../models/flaw.model";
// @ts-ignore
import {validate} from "../middleware/validate.js"
// @ts-ignore
import {verifyRole} from "../middleware/verifyRole.js"
// @ts-ignore
import {verifyJWT} from "../middleware/verifyJWT.js"

const userRouter = Router();

userRouter.post("/:userID/addFault", verifyJWT, verifyRole("student"), validate(newFaultSchema), addFault);
userRouter.get("/:userID/showFaults", showFaults);

export default userRouter;
