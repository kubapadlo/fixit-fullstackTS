import { RegisterUserDTO } from "../types/user.types";

export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  findById(id: string): Promise<any>;
  countByLocation(dorm: string, room: string): Promise<number>;
  create(data: RegisterUserDTO & { passwordHash: string }): Promise<any>;
}