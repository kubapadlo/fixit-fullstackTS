import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { INVALID_REFRESH_TOKEN } from "src/errors/errors";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if(err instanceof AppError) {
  
    if (err instanceof INVALID_REFRESH_TOKEN) {
      res.clearCookie("accessToken", { httpOnly: true });
      res.clearCookie("refreshToken", { httpOnly: true });
    }
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
}

export default errorMiddleware;