import { prisma } from "../../lib/prisma";
import { cloudinary } from "../config/cloudinary";
import { createReadStream } from 'streamifier';
import { newFaultBody, updateStateBody } from "../types/fault.types";

export class FaultService {
  // Pomocnicza metoda prywatna (odpowiednik private w NestJS)
  private async uploadToCloudinary(filebuffer: Buffer): Promise<{ url: string | undefined; id: string | undefined }> {
    return new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream({ folder: "fixIT_uploads" }, (err, upload_data) => {
        if (err) return reject(err);
        resolve({ url: upload_data?.secure_url, id: upload_data?.public_id });
      });
      createReadStream(filebuffer).pipe(upload_stream);
    });
  }

  async createFault(userId: string, data: newFaultBody, fileBuffer?: Buffer) {
    const foundUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!foundUser) throw new Error("USER_NOT_FOUND");

    let imageURL, imageID;
    if (fileBuffer) {
      const { url, id } = await this.uploadToCloudinary(fileBuffer);
      imageURL = url;
      imageID = id;
    }

    return await prisma.fault.create({
      data: {
        reportedAt: new Date(),
        reportedById: userId,
        category: data.category,
        description: data.description,
        state: data.state,
        imageURL,
        imageID
      }
    });
  }

  async getUserFaults(userId: string) {
    const foundUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!foundUser) throw new Error("USER_NOT_FOUND");

    return await prisma.fault.findMany({
      where: { reportedById: userId }
    });
  }

  async getAllFaults() {
    return await prisma.fault.findMany({
      include: {
        reportedBy: {
          select: { firstName: true, lastName: true, dorm: true, room: true }
        }
      }
    });
  }

  async updateFault(faultId: string, userId: string, description: string, fileBuffer?: Buffer) {
    const faultToUpdate = await prisma.fault.findUnique({ where: { id: faultId } });
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

    return await prisma.fault.update({
      where: { id: faultId, reportedById: userId },
      data: newData
    });
  }

  async addReview(faultId: string, technicianId: string, data: updateStateBody) {
    const { state, review } = data;
    const faultToReview = await prisma.fault.findUnique({ where: { id: faultId } });

    if (!faultToReview) throw new Error("FAULT_NOT_FOUND");
    if (faultToReview.assignedToId && faultToReview.assignedToId !== technicianId) throw new Error("ASSIGNED_TO_OTHER");
    if (faultToReview.state === 'reported' && state === "fixed") throw new Error("NOT_ASSIGNED_YET");
    if (faultToReview.state === 'fixed' && state !== 'fixed') throw new Error("CANNOT_UNDO_FIXED");

    const updateData: any = { state };
    if (state === "assigned") updateData.assignedToId = technicianId;
    if (state === "fixed") updateData.review = review ?? faultToReview.review;

    return await prisma.fault.update({
      where: { id: faultId },
      data: updateData
    });
  }

  async deleteFault(faultId: string, userId: string) {
    const fault = await prisma.fault.findFirst({
      where: { id: faultId, reportedById: userId }
    });

    if (!fault) throw new Error("FAULT_NOT_FOUND");
    if (fault.state === "assigned" || fault.state === "fixed") throw new Error("DELETE_FORBIDDEN");

    await prisma.fault.delete({ where: { id: faultId } });

    if (fault.imageID) {
      await cloudinary.uploader.destroy(fault.imageID);
    }
    return fault;
  }
}