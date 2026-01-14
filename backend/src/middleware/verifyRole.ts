import { Request, Response, NextFunction } from "express";

export const verifyRole = (...roles : string[]) => {
  return (req:Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ message: "You are not allowed to enter this page" });
    }
    next();
  };
};
