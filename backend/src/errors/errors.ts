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

export class NOT_FOUND extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  } 
}

export class INVALID_REFRESH_TOKEN extends AppError {
  constructor(message = "Invalid refresh token") {
    super(message, 401);
  }
};

export class UNAUTHORIZED extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
};

export class FAULT_STATE_UPDATE_ERROR extends AppError {
  constructor(message = "Error changing fault state") {
    super(message, 409);
  }
};

export class DELETE_FORBIDDEN extends AppError {
  constructor(message = "You are not allowed to delete this fault") {
    super(message, 403);
  } 
};