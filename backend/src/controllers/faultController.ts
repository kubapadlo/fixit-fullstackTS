import { Request, Response } from "express";
import multer, { FileFilterCallback } from 'multer';
import { FaultService } from "../services/fault.service";

// --- MULTER CONFIG ---
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format') as any, false);
  }
};
export const upload = multer({ storage, fileFilter }).single('image');

// --- CONTROLLER ---
const faultService = new FaultService();

export class FaultController {
  static async addFault(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await faultService.createFault(userId, req.body, req.file?.buffer);
      return res.status(201).json({ newFault: result, message: "New fault created" });
    } catch (error: any) {
      if (error.message === "USER_NOT_FOUND") return res.status(404).json({ message: error.message });
      return res.status(500).json({ message: "Error adding fault", error: error.message });
    }
  }

  static async showFaults(req: Request, res: Response) {
    try {
      const faults = await faultService.getUserFaults(req.user!.userId);
      return res.status(200).json({ faults });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllFaults(req: Request, res: Response) {
    try {
      const faults = await faultService.getAllFaults();
      return res.status(200).json(faults);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch faults" });
    }
  }

  static async editFault(req: Request, res: Response) {
    try {
      const result = await faultService.updateFault(
        req.params.faultID,
        req.user!.userId,
        req.body.description,
        req.file?.buffer
      );
      return res.status(200).json({ updatedFault: result, message: "Successfully updated" });
    } catch (error: any) {
      const status = error.message === "FAULT_NOT_FOUND" ? 404 : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  static async addReview(req: Request, res: Response) {
    try {
      const result = await faultService.addReview(req.params.faultID, req.user!.userId, req.body);
      return res.status(200).json({ faultToReview: result, message: "Successfully added a review" });
    } catch (error: any) {
      if (error.message === "FAULT_NOT_FOUND") return res.status(404).json({ message: error.message });
      if (error.message === "ASSIGNED_TO_OTHER") return res.status(403).json({ message: error.message });
      return res.status(400).json({ message: error.message });
    }
  }

  static async deleteFault(req: Request, res: Response) {
    try {
      const result = await faultService.deleteFault(req.params.faultID, req.user!.userId);
      return res.status(200).json({ message: "Deleted successfully", deletedFault: result });
    } catch (error: any) {
      if (error.message === "FAULT_NOT_FOUND") return res.status(404).json({ message: error.message });
      if (error.message === "DELETE_FORBIDDEN") return res.status(403).json({ message: error.message });
      return res.status(500).json({ message: "Error while deleting" });
    }
  }
}