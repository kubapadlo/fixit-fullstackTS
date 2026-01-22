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
    return prisma.fault.findMany({ where: { reportedById: userId } });
  }

  async findAllWithUser() {
    return prisma.fault.findMany({
      include: {
        reportedBy: {
          select: { firstName: true, lastName: true, dorm: true, room: true }
        }
      }
    });
  }

  async update(id: string, data: any) {
    return prisma.fault.update({ where: { id }, data });
  }

  async updateWithUserCheck(id: string, userId: string, data: any) {
    return prisma.fault.update({
      where: { id, reportedById: userId },
      data
    });
  }

  async delete(id: string) {
    return prisma.fault.delete({ where: { id } });
  }
}