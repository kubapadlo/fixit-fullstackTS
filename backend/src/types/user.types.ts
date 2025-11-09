import { JwtPayload } from 'jsonwebtoken';
import {Document} from 'mongoose'

export interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
  role: string;
  location? : {
    dorm: string,
    room: string
  };
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: string;
  location?: {
    dorm: string;
    room: string;
  };
}

export interface MyJwtPayload extends JwtPayload {
  userId: number;
  role: string
}


declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload;    // dzieki '?' dziala rowniez w trasach ktore nie korzystaja z JWT
    }
  }
}