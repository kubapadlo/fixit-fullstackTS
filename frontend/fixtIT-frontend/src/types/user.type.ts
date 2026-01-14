// dla global state
export type User = {
    id: string,
    fullName: string,
    role:string
}

export interface ReportedBy {
  _id: string;
  firstName: string;
  lastName: string;
  dorm: string;
  room: string;
}