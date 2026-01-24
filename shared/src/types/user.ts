import { z } from "zod";

// ------------------ POMOCNICZE --------------------
export type UserRole = "student" | "technician" | "admin";

export const locationSchema = z.object({
  dorm: z.string().min(1, "Dorm is required"),
  room: z.string().min(1, "Room is required"),
});

// -------------- pola do formsów ---------------------
export const registerFieldSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(4, "Min 4 characters"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  role: z.enum(["student", "technician", "admin"]),
  location: locationSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.role === "student" && !data.location) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Location is required for students",
      path: ["location"],
    });
  }
});

export const loginFieldSchema = z.object({
  email: z.email("Niepoprawny format email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});
// ------------------------------------------------------

// --------------- schematy dla walidatora --------------------
export const registerRequestSchema = z.object({
  body: registerFieldSchema,
});

export const loginRequestSchema = z.object({
  body: loginFieldSchema,
});
// ------------------------------------------------------



// ----------------DTO(typy Requestow) -------------------------
export type RegisterDTO = z.infer<typeof registerFieldSchema>;
export type LoginDTO = z.infer<typeof loginFieldSchema>;
// --------------------------------------------------------------


// ------------- RESPONSY Z BACKENDU ---------------------
// info o userze zwracane przy logowaniu / odswiezaniu tokena
export interface AuthUser {
  id: string;
  fullName: string;
  role: UserRole;
}

export interface LoginResponse {  // to samo dla login i refresh ENDPOINT
  user: AuthUser;
  message: string;
}

export interface RegisterResponse{
    message: string
}
// -----------------------------------------------------------

export interface IUserBase {
  id: string; 
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  location?: {
    dorm: string;
    room: string;
  };
}

export type User = IUserBase;