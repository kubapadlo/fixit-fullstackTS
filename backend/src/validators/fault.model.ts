import Joi from "joi";

export const newFaultSchema = {
  body: Joi.object({
    reportedAt: Joi.date().default(()=> new Date()),
    category: Joi.string().valid('Elektryk', 'Hydraulik', 'Murarz', 'Malarz', 'Stolarz', 'Ślusarz').default(''),
    description: Joi.string().required(),
    state: Joi.string().valid('reported', 'fixed', 'assigned').default('reported'),
    review: Joi.string().allow('').optional(),
    assignedTo: Joi.string().optional(),
    imageURL: Joi.string().uri().allow(''),
    imageID: Joi.string().allow('')
  }).and('imageURL', 'imageID') // albo oba pola są obecne albo żadne
};

export const editFaultSchema = {
  body: Joi.object({
    description: Joi.string(),
  }).unknown(false)
}

export const addReviewSchema = {
  body: Joi.object({
    review: Joi.string(),
    state:  Joi.string().valid('reported', 'fixed', 'assigned')
  }).unknown(false)
}