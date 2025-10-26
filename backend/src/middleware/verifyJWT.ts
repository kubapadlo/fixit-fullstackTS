import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Rozszerzenie typu Request, żeby dodać user
interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

export const verifyJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Brak tokena" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
        token,
        process.env.SECRET_ACCESS_KEY as string, 
        (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
            if (err) {
                return res.status(403).json({ message: "Invalid access token" });
            }
            req.user = decoded;
            next();
        }
    );
};
