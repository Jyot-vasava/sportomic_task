// models/Transaction.js
import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    booking_id: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["Booking", "Coaching"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Success", "Dispute", "Refunded"],
      default: "Success",
    },
    transaction_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
