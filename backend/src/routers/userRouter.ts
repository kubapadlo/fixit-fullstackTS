import { Router } from "express";

import { addFault, addReview, deleteFault, editFault, getAllFaults, showFaults, upload } from "../controllers/userController";

import { addReviewSchema, editFaultSchema, newFaultSchema } from "../validators/fault.model";

// middleware
import {validate} from "../middleware/validate"
import {verifyRole} from "../middleware/verifyRole"
import {verifyJWT} from "../middleware/verifyJWT"
import {multerErrorHandler} from "../middleware/multerErrorHandler"

const userRouter = Router();

userRouter.post("/addFault", verifyJWT, upload, multerErrorHandler, validate(newFaultSchema), addFault);
userRouter.get("/showFaults", verifyJWT, showFaults);
userRouter.get("/getAllFaults", getAllFaults);
userRouter.put('/:faultID/edit', verifyJWT, upload, validate(editFaultSchema), editFault)
userRouter.put('/:faultID/review', verifyJWT, verifyRole('technician'), validate(addReviewSchema), addReview)
userRouter.delete('/:faultID/delete', verifyJWT, deleteFault)

export default userRouter;
