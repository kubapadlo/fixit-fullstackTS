import { Category, FaultState } from "@prisma/client"; 

export interface newFaultBody {
  category: Category;      // Zamiast string
  description: string;
  state?: FaultState;      // Zamiast string?
}

export interface updateStateBody{
  state: string;
  review: string;
}