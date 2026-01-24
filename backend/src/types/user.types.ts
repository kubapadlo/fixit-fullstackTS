import { JwtPayload } from 'jsonwebtoken';

export interface MyJwtPayload extends JwtPayload {
  userId: string;
  role: string
}

// req.user
declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload;    // dzieki '?' dziala rowniez w trasach ktore nie korzystaja z JWT
    }
  }
}
