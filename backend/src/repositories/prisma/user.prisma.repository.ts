import { prisma } from "../../../lib/prisma"
import { IUserRepository } from "../user.repository.interface";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
  async countByLocation(dorm: string, room: string) {
    return prisma.user.count({ where: { dorm, room } });
  }
  async create(data: any) {
    return prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: data.passwordHash, // Zapisujemy tylko hash
        role: data.role || "student",
        // Spłaszczamy obiekt location do kolumn SQL
        dorm: data.location.dorm, 
        room: data.location.room
        
        // Zauważ, że NIE przekazujemy pola 'password'
      }
    });
  }
}