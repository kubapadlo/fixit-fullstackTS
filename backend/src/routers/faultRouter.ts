import { Router } from "express";
import multer, { FileFilterCallback } from 'multer';
import { Request } from "express";

// Kontroler (instancja przekazana w fabryce)
import { FaultController } from "../controllers/faultController";

// Schematy walidacji
import { addReviewRequestSchema, deleteFaultParamsSchema, createFaultRequestSchema } from "@shared/types/fault";

// Middleware
import { validate } from "../middleware/validate";
import { verifyRole } from "../middleware/verifyRole";
import { verifyJWT } from "../middleware/verifyJWT";
import { multerErrorHandler } from "../middleware/multerErrorHandler";

// --- KONFIGURACJA MULTERA ---
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format') as any, false);
  }
};
const upload = multer({ storage, fileFilter }).single('image');

// --- FABRYKA ROUTERA ---
export const createFaultRouter = (faultController: FaultController) => {
  const faultRouter = Router();

  // Dodawanie usterki
  faultRouter.post("/addFault", verifyJWT, upload, multerErrorHandler, validate(createFaultRequestSchema), faultController.addFault);

  // Usterki zalogowanego użytkownika
  faultRouter.get("/showFaults", verifyJWT, faultController.showFaults);

  // Wszystkie usterki (publiczne lub dla admina)
  faultRouter.get("/getAllFaults", faultController.getAllFaults);

  // Edycja usterki - aktualnie nieużywany endpoint
  // faultRouter.put('/:faultID/edit', verifyJWT, upload, validate(editFaultSchema), faultController.editFault);

  // Dodawanie recenzji (tylko dla technika)
  faultRouter.put('/:faultID/review', verifyJWT, verifyRole('technician'), validate(addReviewRequestSchema), faultController.addReview);

  // Usuwanie usterki
  faultRouter.delete('/:faultID/delete', verifyJWT, validate(deleteFaultParamsSchema), faultController.deleteFault);

  return faultRouter;
};