import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../types/user.types";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const secret = process.env.SECRET_ACCESS_KEY;

  if (!secret) {
    console.error("Błąd: SECRET_ACCESS_KEY nie jest zdefiniowany w pliku .env");
    return res.status(500).json({ message: "Błąd konfiguracji serwera" });
  }
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Brak tokena" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_ACCESS_KEY!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    // Zapisz dane użytkownika do req.user, żeby inne middleware miały dostęp
    req.user = decoded as MyJwtPayload;
    next();
  });
};
