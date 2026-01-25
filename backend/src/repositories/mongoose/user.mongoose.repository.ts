import User from "../../models/user.model";
import { IUserRepository } from "../user.repository.interface";

export class MongooseUserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }
  async findById(id: string) {
    return User.findById(id);
  }
  async countByLocation(dorm: string, room: string) {
    return User.countDocuments({ "location.dorm": dorm, "location.room": room });
  }
  async create(data: any) {
    // Mapowanie danych z płaskiej struktury SQL na zagnieżdżoną Mongo
    return User.create({
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      location: { dorm: data.dorm, room: data.room }
    });
  }
}