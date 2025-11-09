import { Document } from 'mongoose'
import { IUser } from './user.types';

export interface newFaultBody{
  description: string;
  state?: string;
  review?: string;
}

export interface IFault extends Document {
  reportedBy: String;
  reportedAt : Date;
  description: string;
  state: string;
  review: string;
}