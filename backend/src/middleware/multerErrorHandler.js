import multer from "multer";

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(404).send("blad multera: " + err.message);
  } else if (err) {
    return res.status(404).send(err.message);
  }
  next();
};
