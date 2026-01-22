// import { Category, FaultState } from "@prisma/client"; 
import { Document } from 'mongoose'

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
  category: string;      // Zamiast string
  description: string;
  state?: string;      // Zamiast string?
}

export interface updateStateBody{
  state: string;
  review: string;
}