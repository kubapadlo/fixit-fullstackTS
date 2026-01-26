import { FaultWithUserID, FaultWithUserObject, ICreateFaultData } from "@shared/types/fault";

export interface IFaultRepository {
  create(data: ICreateFaultData): Promise<any>;
  findById(id: string): Promise<any>;
  findManyByUserId(userId: string): Promise<any[]>;
  findAllWithUser(): Promise<any[]>;
  update(id: string, data: any): Promise<any>;
  updateWithUserCheck(id: string, userId: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
}