import { FaultWithUserObject } from "@shared/types/fault";
import { prisma } from "../../../lib/prisma";
import { IFaultRepository } from "../fault.repository.interface";

export class PrismaFaultRepository implements IFaultRepository {
  async create(data: any) {
    return prisma.fault.create({ data });
  }

  async findById(id: string) {
    return prisma.fault.findUnique({ where: { id } });
  }

  async findManyByUserId(userId: string) {
    return prisma.fault.findMany({ where: { reportedBy: userId } });
  }

  async findAllWithUser() {
    return prisma.fault.findMany({
      include: {
        reportedByUser: {
          select: { firstName: true, lastName: true, dorm: true, room: true }
        }
      }
    });
  }

  async update(id: string, data: any): Promise<any> {
    return prisma.fault.update({ where: { id }, data });
  }

  async updateWithUserCheck(id: string, userId: string, data: any) {
    return prisma.fault.update({
      where: { id, reportedBy: userId },
      data
    });
  }

  async delete(id: string) {
    return prisma.fault.delete({ where: { id } });
  }
}