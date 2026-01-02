import { Document } from 'mongoose'
import { IUser } from './user.types';

export interface newFaultBody{
  category: string
  description: string;
  state?: string;
  review?: string;
}

export interface IFault extends Document {
  reportedBy: String;
  reportedAt : Date;
  category: string;
  description: string;
  state: string;
  review: string;
  imageURL: string
  imageID: string  // konieczne do usuwania zdjec z cloudinary
}