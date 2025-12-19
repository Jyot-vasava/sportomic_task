// models/Sport.js
import mongoose, { Schema } from "mongoose";

const sportSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Sport = mongoose.model("Sport", sportSchema);
