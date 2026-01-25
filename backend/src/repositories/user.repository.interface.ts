import { RegisterDTO } from "@shared/types/user";

export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  findById(id: string): Promise<any>;
  countByLocation(dorm: string, room: string): Promise<number>;
  create(data: RegisterDTO & { passwordHash: string }): Promise<any>;
}