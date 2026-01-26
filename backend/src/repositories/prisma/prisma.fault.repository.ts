import { FaultWithUserObject, ICreateFaultData } from "@shared/types/fault";
import { prisma } from "../../../lib/prisma";
import { IFaultRepository } from "../fault.repository.interface";

export class PrismaFaultRepository implements IFaultRepository {
  async create(data: ICreateFaultData) {
    return prisma.fault.create({
      data: {
        description: data.description,
        category: data.category as any, // rzutowanie na Enum Prismy
        state: data.state as any,
        reportedAt: data.reportedAt,
        imageURL: data.imageURL,
        imageID: data.imageID,
        // Używamy pola id bezpośrednio (kolumna reportedBy w bazie)
        reportedBy: data.reportedBy, 
        // LUB alternatywnie (jeśli wolisz connect):
        // reportedByUser: { connect: { id: data.reportedBy } }
      }
    });
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