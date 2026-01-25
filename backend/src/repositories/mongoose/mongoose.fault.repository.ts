import { FaultWithUserID, FaultWithUserObject } from "@shared/types/fault";
import {Fault} from "../../models/fault.model" // Zakładam że masz taki model
import { IFaultRepository } from "../fault.repository.interface";

export class MongooseFaultRepository implements IFaultRepository {
  async create(data: any) {
    // Mapowanie reportedById na reportedBy dla Mongo jeśli trzeba
    const mongoData = { ...data, reportedBy: data.reportedById };
    delete mongoData.reportedById;
    return Fault.create(mongoData);
  }

  async findById(id: string) {
    return Fault.findById(id);
  }

  async findManyByUserId(userId: string) {
    return Fault.find({ reportedBy: userId });
  }

  async findAllWithUser() {
    return Fault.find().populate('reportedBy');
  }

  async update(id: string, data: any): Promise<any> {
    return Fault.findByIdAndUpdate(id, data, { new: true });
}

  async updateWithUserCheck(id: string, userId: string, data: any) {
    return Fault.findOneAndUpdate({ _id: id, reportedBy: userId }, data, { new: true });
  }

  async delete(id: string) {
    return Fault.findByIdAndDelete(id);
  }
}