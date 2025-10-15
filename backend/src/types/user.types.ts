export interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export interface User {
  username: string;
  email: string;
  passwordHash: string;
}
