import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Rozszerzenie typu Request, żeby dodać user
interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const verifyRole = (...roles : string[]) => (req: AuthenticatedRequest,res:Response,next:NextFunction) =>{
    if (!roles.includes(req.user?.role)){
        return res.status(401).json({message: "You are not allowed to enter this page"})
    }
    next();
}