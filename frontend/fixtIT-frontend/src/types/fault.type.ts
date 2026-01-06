import type { ReportedBy } from "./user.type";

interface Fault<TUser> {
  _id: string;
  reportedAt: string;  
  reportedBy: TUser;
  category: 'Elektryk' | 'Hydraulik' | 'Murarz' | 'Malarz' | 'Stolarz' | 'Ślusarz';
  description: string;
  imageID: string;
  imageURL: string;
  review: string;
  state: "reported" | "assigned" | "fixed";
  __v: number;
}

export type FaultWithUserID = Fault<string>;
export type FaultWithUserObject = Fault<ReportedBy>;