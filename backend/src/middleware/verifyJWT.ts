import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../types/user.types";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken

  if(!token){
    return res.status(401).json({message: "No access token in the cookie"})
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY!, (err:any, decoded:any) => {
    if (err) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    req.user = decoded as MyJwtPayload;
    next();
  });
};
