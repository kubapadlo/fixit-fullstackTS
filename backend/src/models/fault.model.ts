import mongoose, { Schema, Model, model } from "mongoose";

interface IFault extends Document {
  reportedBy: String;
  reportedAt : Date;
  category: string;
  description: string;
  state: string;
  assignedTo: String;
  review: string;
  imageURL: string
  imageID: string  
}

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