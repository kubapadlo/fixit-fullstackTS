import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../repositories/user.repository.interface";
// Zakładam, że te typy są importowane z pliku, który podałeś
import { 
  RegisterDTO, 
  LoginDTO, 
  AuthUser, 
  User, 
  UserRole 
} from "@shared/types/user";
import { MyJwtPayload } from "../types/auth.types";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Mapuje surowe dane z bazy na ustandaryzowany obiekt AuthUser (używany w tokenach/sesji)
   */
  private mapToAuthUser(user: any): AuthUser {
    return {
      id: user.id || user._id?.toString(),
      fullName: user.fullName || `${user.firstName} ${user.lastName}`,
      role: user.role as UserRole,
    };
  }

  /**
   * Mapuje dane na pełny obiekt User (jeśli potrzebujesz pełnych danych profilowych)
   */
  private mapToUser(user: any): User {
    return {
      id: user.id || user._id?.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserRole,
      location: user.location,
    };
  }

  async register(data: RegisterDTO): Promise<User> {
    const alreadyExists = await this.userRepository.findByEmail(data.email);
    if (alreadyExists) throw new Error("USER_ALREADY_EXISTS");

    // Logika biznesowa: tylko studenci mają limit w pokoju
    if (data.role === "student" && data.location) {
      const count = await this.userRepository.countByLocation(
        data.location.dorm, 
        data.location.room
      );
      if (count >= 2) throw new Error("ROOM_FULL");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Tworzymy użytkownika w bazie
    const newUser = await this.userRepository.create({
      ...data,
      //role: "student", 
      passwordHash: hashedPassword,
    });

    // Zwracamy pełny obiekt User zgodnie z Twoim interfejsem
    return this.mapToUser(newUser);
  }

  async validateUser(data: LoginDTO): Promise<AuthUser> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new Error("USER_NOT_FOUND");
    
    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) throw new Error("INVALID_CREDENTIALS");

    // Do celów logowania zwracamy AuthUser (id, fullName, role)
    return this.mapToAuthUser(user);
  }

  generateTokens(user: AuthUser) {
    const payload: MyJwtPayload = { 
      userId: user.id, 
      role: user.role 
    };
    
    const accessToken = jwt.sign(
      payload, 
      process.env.SECRET_ACCESS_KEY!, 
      { expiresIn: "15m" }
    );
    
    const refreshToken = jwt.sign(
      payload, 
      process.env.SECRET_REFRESH_KEY!, 
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(
        token, 
        process.env.SECRET_REFRESH_KEY!
      ) as MyJwtPayload;

      const user = await this.userRepository.findById(decoded.userId);
      if (!user) throw new Error("USER_NOT_FOUND");

      return this.mapToAuthUser(user);
    } catch (err) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }
  }
}