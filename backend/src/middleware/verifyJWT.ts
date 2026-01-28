import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../types/auth.types";
import { UNAUTHORIZED } from "src/errors/errors";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken

  if(!token) throw new UNAUTHORIZED("No access token in the cookies");

  jwt.verify(token, process.env.SECRET_ACCESS_KEY!, (err:any, decoded:any) => {
    if (err) throw new UNAUTHORIZED("Invalid or expired access token");
    
    req.user = decoded as MyJwtPayload;
    next();
  });
};
