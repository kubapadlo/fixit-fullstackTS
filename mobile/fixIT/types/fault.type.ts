export interface Fault {
  _id: string;
  reportedAt: string;  
  reportedBy: string;
  category: 'Elektryk' | 'Hydraulik' | 'Murarz' | 'Malarz' | 'Stolarz' | 'Ślusarz';
  description: string;
  imageID: string;
  imageURL: string;
  review: string;
  state: "reported" | "assigned" | "fixed";
  __v: number;
}
