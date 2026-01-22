import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../repositories/user.repository.interface";
import { RegisterUserDTO, LoginUserDTO, MyJwtPayload } from "../types/user.types";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(data: RegisterUserDTO) {
    const alreadyExists = await this.userRepository.findByEmail(data.email);
    if (alreadyExists) throw new Error("USER_ALREADY_EXISTS");

    const count = await this.userRepository.countByLocation(data.location.dorm, data.location.room);
    if (count >= 2) throw new Error("ROOM_FULL");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.userRepository.create({
      ...data,
      passwordHash: hashedPassword,
      //role: "student"
    });
  }

  async validateUser(data: LoginUserDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new Error("USER_NOT_FOUND");

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) throw new Error("INVALID_CREDENTIALS");

    // Unifikacja ID (Mongo używa _id, Prisma id)
    return {
      id: user.id || user._id.toString(),
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };
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
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) throw new Error("USER_NOT_FOUND");
      return {
        id: user.id || user._id.toString(),
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      };
    } catch (err) {
      throw new Error("INVALID_TOKEN");
    }
  }
}