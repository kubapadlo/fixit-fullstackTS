import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDTO, LoginResponse, RegisterDTO, RegisterResponse } from "@shared/index";

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge
});

// kontroler zajmuje sie obsługa tylko pomyslnych odpowiedzi
// bledy rzucane przez serwis sa obslugiwane przez globalny handler bledow

export class AuthController {
  // Wstrzykujemy serwis przez konstruktor
  constructor(private authService: AuthService) {}

  register = async (req: Request<{}, {}, RegisterDTO>, res: Response<RegisterResponse>) => {
    await this.authService.register(req.body);
    return res.status(201).json({ message: "User created successfully" });
  }

  login = async (req: Request<{}, {}, LoginDTO>, res: Response<LoginResponse | {message:string}>) => {
    try {
      const user = await this.authService.validateUser(req.body);
      const { accessToken, refreshToken } = this.authService.generateTokens(user);
      res.cookie("accessToken", accessToken, cookieOptions(1 * 60 * 1000));
      res.cookie("refreshToken", refreshToken, cookieOptions(60 * 60 * 1000));

      return res.status(200).json({
        user: { id: user.id, role: user.role, fullName: user.fullName },
        message: "Logged successfully"
      });
    } catch (error: any) {
      if (error.message === "USER_NOT_FOUND" || error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      return res.status(500).json({ message: "Server error during login" });
    }
  }

  refreshToken = async (req: Request<{}, {}, LoginDTO>, res: Response<LoginResponse | { message: string }>) => {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) return res.status(401).json({ message: "No refresh token" });

      const user = await this.authService.verifyRefreshToken(token);
      const { accessToken } = this.authService.generateTokens(user);

      res.cookie("accessToken", accessToken, cookieOptions(1 * 60 * 1000));
      return res.status(200).json({
        user: { id: user.id, role: user.role, fullName: user.fullName }, message: "Token refreshed successfully"
      });
    } catch (error: any) {
      res.clearCookie("accessToken", { httpOnly: true });
      res.clearCookie("refreshToken", { httpOnly: true });
      return res.status(401).json({ message: "Token expired or invalid" });
    }
  }

  logout = (req: Request, res: Response) => {
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });
    return res.sendStatus(204);
  }
}