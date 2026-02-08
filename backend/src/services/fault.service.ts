import { cloudinary } from "../config/cloudinary";
import { createReadStream } from 'streamifier';
import { IFaultRepository } from "../repositories/fault.repository.interface";
import { IUserRepository } from "../repositories/user.repository.interface";
import { CreateFaultDTO, EditFaultDTO, AddReviewDTO, IFault, FaultWithUserObject, FaultWithUserID } from "@shared/types/fault";
import { DELETE_FORBIDDEN, FAULT_STATE_UPDATE_ERROR, NOT_FOUND } from "src/errors/errors";
import { CacheService } from "./cache.service";

export class FaultService {
  constructor(
    private faultRepository: IFaultRepository,
    private userRepository: IUserRepository,
    private cache: CacheService
  ) {}

  private async uploadToCloudinary(filebuffer: Buffer): Promise<{ url: string | undefined; id: string | undefined }> {
    return new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream({ folder: "fixIT_uploads" }, (err, upload_data) => {
        if (err) return reject(err);
        resolve({ url: upload_data?.secure_url, id: upload_data?.public_id });
      });
      createReadStream(filebuffer).pipe(upload_stream);
    });
  }

  async createFault(userId: string, data: CreateFaultDTO, fileBuffer?: Buffer) {
    const foundUser = await this.userRepository.findById(userId);
    if (!foundUser) throw new NOT_FOUND("User not found");

    let imageURL, imageID;
    if (fileBuffer) {
      const { url, id } = await this.uploadToCloudinary(fileBuffer);
      imageURL = url;
      imageID = id;
    }

    this.cache.invalidate("faults:*")
    
    return await this.faultRepository.create({
      reportedAt: new Date(),
      reportedBy: userId,
      category: data.category,
      description: data.description,
      state: data.state,
      imageURL,
      imageID
    });
  }

  async getUserFaults(userId: string) {
    return this.cache.getOrSet<FaultWithUserID[]>(
      `faults:${userId}`,                
      () => this.faultRepository.findManyByUserId(userId), 
      60                          
    );
  }

  async getAllFaults() {
    return this.cache.getOrSet<FaultWithUserObject[]>(
      'faults:all',                
      () => this.faultRepository.findAllWithUser(), 
      60                          
    );
  }

  async updateFault(faultId: string, userId: string, description: string, fileBuffer?: Buffer) {
    const faultToUpdate = await this.faultRepository.findById(faultId);
    if (!faultToUpdate) throw new NOT_FOUND("FAULT_NOT_FOUND");

    const newData: any = { description };

    if (fileBuffer) {
      if (faultToUpdate.imageID) {
        await cloudinary.uploader.destroy(faultToUpdate.imageID);
      }
      const { url, id } = await this.uploadToCloudinary(fileBuffer);
      newData.imageURL = url;
      newData.imageID = id;
    }

    return await this.faultRepository.updateWithUserCheck(faultId, userId, newData);
  }

  async addReview(faultId: string, technicianId: string, data: AddReviewDTO) {
    const { state, review } = data;
    const faultToReview: FaultWithUserObject | null = await this.faultRepository.findById(faultId);

    if (!faultToReview) throw new NOT_FOUND("FAULT_NOT_FOUND");
    if (faultToReview.assignedTo && faultToReview.assignedTo.toString() !== technicianId) throw new FAULT_STATE_UPDATE_ERROR("ASSIGNED_TO_OTHER");
    if (faultToReview.state === 'reported' && state === "fixed") throw new FAULT_STATE_UPDATE_ERROR("NOT_ASSIGNED_YET");
    if (faultToReview.state === 'fixed' && state !== 'fixed') throw new FAULT_STATE_UPDATE_ERROR("CANNOT_UNDO_FIXED");

    const updateData: Partial<FaultWithUserObject> = { state };
    if (state === "assigned") updateData.assignedTo = technicianId;
    if (state === "fixed") updateData.review = review ?? faultToReview.review;

    return await this.faultRepository.update(faultId, updateData);
  }

  async deleteFault(faultId: string, userId: string) {
    const fault = await this.faultRepository.findById(faultId);
    if (!fault) throw new NOT_FOUND("FAULT_NOT_FOUND");
    if (fault?.reportedBy.toString() !== userId) throw new DELETE_FORBIDDEN();
    if (fault.state === "assigned" || fault.state === "fixed") throw new DELETE_FORBIDDEN();

    const result = await this.faultRepository.delete(faultId);

    if (fault.imageID) {
      await cloudinary.uploader.destroy(fault.imageID);
    }
    return result;
  }
}