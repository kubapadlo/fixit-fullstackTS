import multer from "multer";
// Wywoła się gdy poprzedni middleware wywoła next(error) lub wystąpił wyjątek w async funkcji
// uwaga: multer przu bledzie automatycznie wyrzuci next(error)
import { ErrorRequestHandler } from "express";

export const multerErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(404).send("blad multera: " + err.message);
  } else if (err) {
    return res.status(404).send(err.message);
  }
  next();
};
