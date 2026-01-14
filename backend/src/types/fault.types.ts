import { Document } from 'mongoose'
import { IUser } from './user.types';
import { Category, FaultState } from "@prisma/client"; 

export interface IFault extends Document {
  reportedBy: String;
  reportedAt : Date;
  category: string;
  description: string;
  state: string;
  assignedTo: String;
  review: string;
  imageURL: string
  imageID: string  // konieczne do usuwania zdjec z cloudinary
}

export interface newFaultBody {
  category: Category;      // Zamiast string
  description: string;
  state?: FaultState;      // Zamiast string?
}

export interface updateStateBody{
  state: string;
  review: string;
}