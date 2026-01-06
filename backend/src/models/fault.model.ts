import mongoose, { Schema, Model, model } from "mongoose";
import { IFault } from "../types/fault.types";
import Joi from "joi";

const faultSchema : Schema<IFault> = new Schema({
    reportedBy : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'userid is required']
    },
  reportedAt : {
    type: Date,
    default: Date.now,
    required: [true, "report date is required"]
  },
  category: {
    type: String,
    enum: ['Elektryk', 'Hydraulik', 'Murarz', 'Malarz', 'Stolarz', 'Ślusarz'],
    default: 'reported'
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  state: {
    type: String,
    enum: ['reported', 'assigned', 'fixed'],
    default: 'reported'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  review: {
    type: String,
    default: ''
  },
  imageURL: {
    type: String,
    default: ''
  },
  imageID: {  // konieczne do usuwania zdjec z cloudinary
    type: String,
    default: ''
  }
})

export const Fault : Model<IFault> = mongoose.model<IFault>("Fault", faultSchema)

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