import { JwtPayload } from 'jsonwebtoken';
import {Document} from 'mongoose'

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: string;
  firstName: string;
  lastName: string;
  location?: {
    dorm: string;
    room: string;
  };
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location? : {
    dorm: string,
    room: string
  };
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

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