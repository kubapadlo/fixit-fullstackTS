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
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  state: {
    type: String,
    enum: ['reported', 'fixed'],
    default: 'reported'
  },
  review: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
})

export const Fault : Model<IFault> = mongoose.model<IFault>("Fault", faultSchema)

export const newFaultSchema = {
  body: Joi.object({
    reportedAt: Joi.date().default(()=> new Date()),
    description: Joi.string().required(),
    state: Joi.string().valid('reported', 'fixed').default('reported'),
    review: Joi.string().allow('').optional(),
    image: Joi.string().allow('').uri().optional()
  })
};