import { Router } from "express";

import { FaultController, upload } from "../controllers/faultController"

import { addReviewSchema, editFaultSchema, newFaultSchema } from "../validators/fault.model";

// middleware
import {validate} from "../middleware/validate"
import {verifyRole} from "../middleware/verifyRole"
import {verifyJWT} from "../middleware/verifyJWT"
import {multerErrorHandler} from "../middleware/multerErrorHandler"

const faultRouter = Router();

faultRouter.post("/addFault", verifyJWT, upload, multerErrorHandler, validate(newFaultSchema), FaultController.addFault);
faultRouter.get("/showFaults", verifyJWT, FaultController.showFaults);
faultRouter.get("/getAllFaults", FaultController.getAllFaults);
faultRouter.put('/:faultID/edit', verifyJWT, upload, validate(editFaultSchema), FaultController.editFault)
faultRouter.put('/:faultID/review', verifyJWT, verifyRole('technician'), validate(addReviewSchema), FaultController.addReview)
faultRouter.delete('/:faultID/delete', verifyJWT, FaultController.deleteFault)

export default faultRouter;
