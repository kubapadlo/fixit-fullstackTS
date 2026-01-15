import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { RegisterUserDTO, LoginUserDTO, MyJwtPayload } from "../types/user.types";

// logika biznesowa, walidacja, dostęp do bazy
export class AuthService {
  async register(data: RegisterUserDTO) {
    const { email, password, firstName, lastName, location } = data;

    const alreadyExists = await prisma.user.findUnique({ where: { email } });
    if (alreadyExists) throw new Error("USER_ALREADY_EXISTS");

    const usersInLocationCount = await prisma.user.count({
      where: { dorm: location.dorm, room: location.room }
    });

    if (usersInLocationCount >= 2) throw new Error("ROOM_FULL");

    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role: "student",
        dorm: location.dorm,
        room: location.room
      }
    });
  }

  async validateUser(data: LoginUserDTO) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error("USER_NOT_FOUND");

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) throw new Error("INVALID_CREDENTIALS");

    return user;
  }

  generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
      { userId, role },
      process.env.SECRET_ACCESS_KEY as string,
      { expiresIn: "1m" }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      process.env.SECRET_REFRESH_KEY as string,
      { expiresIn: "1h" }
    );

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_REFRESH_KEY as string) as MyJwtPayload;
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) throw new Error("USER_NOT_FOUND");
      return user;
    } catch (err) {
      throw new Error("INVALID_TOKEN");
    }
  }
}