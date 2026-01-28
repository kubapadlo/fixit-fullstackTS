import { Request, Response } from "express";
import { FaultService } from "../services/fault.service";
import { AddReviewDTO, CreateFaultDTO, CreateFaultResponse, GetUserFaultsResponse } from "@shared/index";
import { UNAUTHORIZED } from "src/errors/errors";

export class FaultController {
  constructor(private faultService: FaultService) {}

  addFault = async (req: Request<{},{}, CreateFaultDTO>, res: Response<CreateFaultResponse | { message: string }>) => {
    const userId = req.user?.userId;
    if (!userId) throw new UNAUTHORIZED("User not authorized to create a fault");
    const result = await this.faultService.createFault(userId, req.body, req.file?.buffer);

    return res.status(201).json({ newFault: result, message: "New fault created" });
  }

  showFaults = async (req: Request, res: Response<GetUserFaultsResponse | { message: string }>) => {
    const faults = await this.faultService.getUserFaults(req.user!.userId); // middleware verifyJWT gwarantuje istnienie req.user
    return res.status(200).json({ faults, message: "User faults fetched successfully" });
  }

  getAllFaults = async (req: Request, res: Response<GetUserFaultsResponse | { message: string }>) => {
    const faults = await this.faultService.getAllFaults();
    return res.status(200).json({faults, message: "All faults fetched successfully"});
  }

  /* Aktualnie nieużywany endpoint
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
  */

  addReview = async (req: Request<{ faultID: string }, {}, AddReviewDTO>, res: Response) => {
    const result = await this.faultService.addReview(req.params.faultID, req.user!.userId, req.body);
    return res.status(200).json({ faultToReview: result, message: "Successfully added a review" });
  }

  deleteFault = async (req: Request<{ faultID: string }>, res: Response) => {
    const result = await this.faultService.deleteFault(req.params.faultID, req.user!.userId);
    return res.status(200).json({ message: "Deleted successfully", deletedFault: result });
  }
}