import { z } from "zod";
import { IUserBase } from "./user";

// ------------------- POMOCNICZE -------------------
export const FAULT_CATEGORIES = ['Elektryk', 'Hydraulik', 'Murarz', 'Malarz', 'Stolarz', 'Ślusarz'] as const;
export const FAULT_STATES = ['reported', 'assigned', 'fixed'] as const;

export type FaultCategory = typeof FAULT_CATEGORIES[number];
export type FaultState = typeof FAULT_STATES[number];
// ---------------------------------------------------

// ------------------ TYP DOMENOWY ---------------------
export interface IFault<TUser> {
  id: string;
  reportedAt: string;  
  reportedBy: TUser;
  category: 'Elektryk' | 'Hydraulik' | 'Murarz' | 'Malarz' | 'Stolarz' | 'Ślusarz';
  description: string;
  imageID: string;
  imageURL: string;
  review: string;
  state: "reported" | "assigned" | "fixed";
  assignedTo: string | null;
  __v?: number;
}

export type FaultWithUserID = IFault<string>;
export type FaultWithUserObject = IFault<IUserBase>;
// ---------------------------------------------------


// ------------------- ZOD SCHEMAS ------------------
export const newFaultSchema = z.object({
  category: z.enum(FAULT_CATEGORIES).default('Elektryk'),
  description: z.string().min(5, "Opis musi mieć min. 5 znaków"),
  state: z.enum(FAULT_STATES).default('reported'),
  review: z.string().optional(),
  imageURL: z.string().url().optional().or(z.literal('')),
  imageID: z.string().optional().or(z.literal('')),
}).refine(data => {
  if ((data.imageURL && !data.imageID) || (!data.imageURL && data.imageID)) {
    return false;
  }
  return true;
}, {
  message: "imageURL and imageID must both be present or both absent",
  path: ["imageURL"]
});

export const editFaultSchema = z.object({
  description: z.string().min(5),
});

export const addReviewSchema = z.object({
  review: z.string().min(1, "Review cannot be empty"),
  state: z.enum(FAULT_STATES)
});
// ----------------------------------------------------------------

// --------------- schematy dla walidatora --------------------
export const createFaultRequestSchema = z.object({
  body: newFaultSchema,
});

export const addReviewRequestSchema = z.object({
  body: addReviewSchema,
  params: z.object({
    faultID: z.string().min(1),
  }),
});

export const deleteFaultParamsSchema = z.object({
  params: z.object({
    faultID: z.string().min(1),
  }),
});     

// --------------------------------------------------------



// -------------------- DTO (typy requestow) ---------------
export type CreateFaultDTO = z.infer<typeof newFaultSchema>;
export type EditFaultDTO = z.infer<typeof editFaultSchema>;
export type AddReviewDTO = z.infer<typeof addReviewSchema>;
// --------------------------------------------------------


// --------------------- RESPONSE TYPES ---------------------
export type CreateFaultResponse = {
  newFault: FaultWithUserID | FaultWithUserObject;
  message: string;
};

export type GetUserFaultsResponse = {
  faults: FaultWithUserObject[];
  message:string;
};

export type AddReviewResponse = {
  faultToReview: FaultWithUserObject | FaultWithUserID;
  message: string;
};
// -----------------------------------------------------------