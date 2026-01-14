import Joi from "joi";

// do walidacji danych ktore przychodzą do backendu
export const userLoginValidationSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
}

export const userRegisterValidationSchema = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("student", "technician", "admin").default("student"),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    location: Joi.object({
      dorm: Joi.string(),
      room: Joi.string()
    }).when("role", {
      is: "student",
      then: Joi.object({
        dorm: Joi.string().required(),
        room: Joi.string().required(),
      }).required(),
      otherwise: Joi.forbidden(), // Technicy / Admini nie powinni mieć pola room
    }),
  })
}
