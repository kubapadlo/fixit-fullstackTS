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
  id: number;
  role: string
}
