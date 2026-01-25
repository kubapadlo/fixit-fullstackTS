import { FAULT_CATEGORIES } from "@fixit/shared/src/types/fault";
import z from "zod";

export const ReportFaultFormSchema = z.object({
  description: z.string().min(5, "Opis musi mieć min. 5 znaków"),
  category: z.enum(FAULT_CATEGORIES, "Musisz wybrać kategorię"),
  image: z.instanceof(File).optional(),
});

export type ReportFaultDTO = z.infer<typeof ReportFaultFormSchema>;