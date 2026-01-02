export interface Fault {
  _id: string;
  reportedAt: string;  
  reportedBy: string;  // obiekt Date z bazy przy przesyłaniu JSONem konwertowany jest na string
  category: 'Elektryk' | 'Hydraulik' | 'Murarz' | 'Malarz' | 'Stolarz' | 'Ślusarz';
  description: string;
  imageID: string;
  imageURL: string;
  review: string;
  state: "fixed" | "pending" | "rejected";
  __v: number;
}