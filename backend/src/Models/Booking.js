  // models/Booking.js
  import mongoose, { Schema } from "mongoose";

  const bookingSchema = new Schema(
    {
      venue_id: {
        type: Schema.Types.ObjectId,
        ref: "Venue",
        required: true,
        index: true,
      },
      sport_id: {
        type: Schema.Types.ObjectId,
        ref: "Sport",
        required: true,
        index: true,
      },
      member_id: {
        type: Schema.Types.ObjectId,
        ref: "Member",
        required: true,
        index: true,
      },
      booking_date: {
        type: Date,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      coupon_code: {
        type: String,
        trim: true,
        uppercase: true,
      },
      status: {
        type: String,
        enum: ["Completed", "Confirmed", "Cancelled"],
        default: "Confirmed",
      },
    },
    { timestamps: true }
  );

  export const Booking = mongoose.model("Booking", bookingSchema);
