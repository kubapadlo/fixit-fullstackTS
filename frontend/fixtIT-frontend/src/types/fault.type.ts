export interface Fault {
  _id: string;
  description: string;
  imageID: string;
  imageURL: string;
  reportedAt: string;   // ISO string z backendu
  reportedBy: string;   // id użytkownika
  review: string;
  state: "fixed" | "pending" | "rejected";
  __v: number;
}