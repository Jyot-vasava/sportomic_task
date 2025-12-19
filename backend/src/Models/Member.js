// models/Member.js
import mongoose, { Schema } from "mongoose";

const memberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    is_trial_user: {
      type: Boolean,
      default: false,
    },
    converted_from_trial: {
      type: Boolean,
      default: false,
    },
    join_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Member = mongoose.model("Member", memberSchema);
