// models/Venue.js
import mongoose, { Schema } from "mongoose";

const venueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Venue = mongoose.model("Venue", venueSchema);
