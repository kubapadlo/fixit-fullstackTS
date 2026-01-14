import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../types/user.types";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if(!token){
    return res.status(401).json({message:"No accesstoken in the cookie"})
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY!, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired access token" });
    }

    // Zapisz dane użytkownika do req.user, żeby inne middleware miały dostęp
    req.user = decoded as MyJwtPayload;
    next();
  });
};