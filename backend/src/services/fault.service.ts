import { cloudinary } from "../config/cloudinary";
import { createReadStream } from 'streamifier';
import { IFaultRepository } from "../repositories/fault.repository.interface";
import { IUserRepository } from "../repositories/user.repository.interface";
import { CreateFaultDTO, EditFaultDTO, AddReviewDTO, IFault } from "@shared/types/fault";

export class FaultService {
  constructor(
    private faultRepository: IFaultRepository,
    private userRepository: IUserRepository
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
    if (!foundUser) throw new Error("USER_NOT_FOUND");

    let imageURL, imageID;
    if (fileBuffer) {
      const { url, id } = await this.uploadToCloudinary(fileBuffer);
      imageURL = url;
      imageID = id;
    }

    return await this.faultRepository.create({
      reportedAt: new Date(),
      reportedById: userId,
      category: data.category,
      description: data.description,
      state: data.state,
      imageURL,
      imageID
    });
  }

  async getUserFaults(userId: string) {
    return await this.faultRepository.findManyByUserId(userId);
  }

  async getAllFaults() {
    return await this.faultRepository.findAllWithUser();
  }

  async updateFault(faultId: string, userId: string, description: string, fileBuffer?: Buffer) {
    const faultToUpdate = await this.faultRepository.findById(faultId);
    if (!faultToUpdate) throw new Error("FAULT_NOT_FOUND");

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
    const faultToReview = await this.faultRepository.findById(faultId);

    if (!faultToReview) throw new Error("FAULT_NOT_FOUND");
    
    const assignedId = faultToReview.assignedToId || faultToReview.assignedTo;
    if (assignedId && assignedId !== technicianId) throw new Error("ASSIGNED_TO_OTHER");
    if (faultToReview.state === 'reported' && state === "fixed") throw new Error("NOT_ASSIGNED_YET");
    if (faultToReview.state === 'fixed' && state !== 'fixed') throw new Error("CANNOT_UNDO_FIXED");

    const updateData: any = { state };
    if (state === "assigned") updateData.assignedToId = technicianId;
    if (state === "fixed") updateData.review = review ?? faultToReview.review;

    return await this.faultRepository.update(faultId, updateData);
  }

  async deleteFault(faultId: string, userId: string) {
    const fault = await this.faultRepository.findById(faultId);

    if (!fault) throw new Error("FAULT_NOT_FOUND");
    if (fault.state === "assigned" || fault.state === "fixed") throw new Error("DELETE_FORBIDDEN");

    const result = await this.faultRepository.delete(faultId);

    if (fault.imageID) {
      await cloudinary.uploader.destroy(fault.imageID);
    }
    return result;
  }
}