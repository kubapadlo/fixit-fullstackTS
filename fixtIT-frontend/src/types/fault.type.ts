import type { ReportedBy } from "./user.type";

interface Fault<TUser> {
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
  __v: number;
}

export type FaultWithUserID = Fault<string>;
export type FaultWithUserObject = Fault<ReportedBy>;