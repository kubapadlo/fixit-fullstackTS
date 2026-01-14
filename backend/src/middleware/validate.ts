import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi"; 

interface ValidationSchema {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
}

export const validate = (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction)=> {
  const parts = ["body", "query", "params"] as const;
  
  for (const part of parts) {
    if (schema[part]) {
      const { error, value } = schema[part].validate(req[part], {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.details.map((d) => d.message),
        });
      }
      req[part] = value;
    }
  }
  next();
};