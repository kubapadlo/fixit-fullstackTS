import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge
});

// OBSŁUGA HTTP
export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, location } = req.body;
      if (!email || !password || !firstName || !lastName || !location) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await authService.register(req.body);
      return res.status(201).json({ message: "User created successfully" });
    } catch (error: any) {
      if (error.message === "USER_ALREADY_EXISTS") return res.status(400).json({ message: "Email already exists" });
      if (error.message === "ROOM_FULL") return res.status(400).json({ message: "Room is already full" });
      return res.status(500).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const user = await authService.validateUser(req.body);
      const { accessToken, refreshToken } = authService.generateTokens(user.id, user.role);

      res.cookie("accessToken", accessToken, cookieOptions(1 * 60 * 1000));
      res.cookie("refreshToken", refreshToken, cookieOptions(60 * 60 * 1000));

      return res.status(200).json({
        user: { id: user.id, role: user.role, fullName: `${user.firstName} ${user.lastName}` },
        message: "Logged successfully"
      });
    } catch (error: any) {
      if (error.message === "USER_NOT_FOUND" || error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      return res.status(500).json({ message: "Server error during login" });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) return res.status(401).json({ message: "No refresh token" });

      const user = await authService.verifyRefreshToken(token);
      const { accessToken } = authService.generateTokens(user.id, user.role);

      res.cookie("accessToken", accessToken, cookieOptions(1 * 60 * 1000));
      return res.status(200).json({
        user: { id: user.id, role: user.role, fullName: `${user.firstName} ${user.lastName}` }
      });
    } catch (error: any) {
      res.clearCookie("accessToken", { httpOnly: true });
      res.clearCookie("refreshToken", { httpOnly: true });
      return res.status(401).json({ message: "Token expired or invalid" });
    }
  }

  static logout(req: Request, res: Response) {
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });
    return res.sendStatus(204);
  }
}