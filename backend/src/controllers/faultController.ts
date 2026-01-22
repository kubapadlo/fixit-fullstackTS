import { Request, Response } from "express";
import { FaultService } from "../services/fault.service";

export class FaultController {
  constructor(private faultService: FaultService) {}

  addFault = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const result = await this.faultService.createFault(userId, req.body, req.file?.buffer);
      return res.status(201).json({ newFault: result, message: "New fault created" });
    } catch (error: any) {
      if (error.message === "USER_NOT_FOUND") return res.status(404).json({ message: error.message });
      return res.status(500).json({ message: "Error adding fault", error: error.message });
    }
  }

  showFaults = async (req: Request, res: Response) => {
    try {
      const faults = await this.faultService.getUserFaults(req.user!.userId);
      return res.status(200).json({ faults });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  getAllFaults = async (req: Request, res: Response) => {
    try {
      const faults = await this.faultService.getAllFaults();
      return res.status(200).json(faults);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch faults" });
    }
  }

  editFault = async (req: Request, res: Response) => {
    try {
      const result = await this.faultService.updateFault(
        req.params.faultID as string,
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

  addReview = async (req: Request, res: Response) => {
    try {
      const result = await this.faultService.addReview(req.params.faultID as string, req.user!.userId, req.body);
      return res.status(200).json({ faultToReview: result, message: "Successfully added a review" });
    } catch (error: any) {
      if (error.message === "FAULT_NOT_FOUND") return res.status(404).json({ message: error.message });
      if (error.message === "ASSIGNED_TO_OTHER") return res.status(403).json({ message: error.message });
      return res.status(400).json({ message: error.message });
    }
  }

  deleteFault = async (req: Request, res: Response) => {
    try {
      const result = await this.faultService.deleteFault(req.params.faultID as string, req.user!.userId);
      return res.status(200).json({ message: "Deleted successfully", deletedFault: result });
    } catch (error: any) {
      if (error.message === "FAULT_NOT_FOUND") return res.status(404).json({ message: error.message });
      if (error.message === "DELETE_FORBIDDEN") return res.status(403).json({ message: error.message });
      return res.status(500).json({ message: "Error while deleting" });
    }
  }
}