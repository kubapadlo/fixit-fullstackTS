import { AppError } from "./AppError";

export class USER_ALREADY_EXISTS extends AppError {
  constructor(message = "User already exists") {
    super(message, 409);
  }
}

export class ROOM_FULL extends AppError {
  constructor(message = "Room is already full") {
    super(message, 400);
  } 
}