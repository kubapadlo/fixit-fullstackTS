export const validate = (schema) => (req, res, next) => {
  for (const part of ["body", "query", "params"]) {
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
