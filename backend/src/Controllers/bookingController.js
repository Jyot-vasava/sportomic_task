// src/controllers/bookingcontroller.js
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import { Booking } from "../Models/Booking";
import { Venue } from "../models/Venue";
import { Sport } from "../models/Sport";
import { Member } from "../models/Member";
import { Transaction } from "../models/Transaction";

const applyCoupon = (baseAmount, code) => {
  const discounts = {
    EARLYBIRD: 0.1,
    SAVE10: 0.1,
    WELCOME50: 0.5,
  };
  return code && discounts[code]
    ? baseAmount * (1 - discounts[code])
    : baseAmount;
};

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("venue_id", "name location")
    .populate("sport_id", "name")
    .populate("member_id", "name");

  res
    .status(200)
    .json(new ApiResponse(200, "Bookings fetched successfully", bookings));
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("venue_id", "name location")
    .populate("sport_id", "name")
    .populate("member_id", "name");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Booking fetched successfully", booking));
});

export const createBooking = asyncHandler(async (req, res) => {
  const {
    venue_id,
    sport_id,
    member_id,
    booking_date,
    base_amount,
    coupon_code,
  } = req.body;

  const venue = await Venue.findById(venue_id);
  const sport = await Sport.findById(sport_id);
  const member = await Member.findById(member_id);

  if (!venue || !sport || !member) {
    throw new ApiError(400, "Invalid venue, sport, or member ID");
  }

  if (member.status !== "Active") {
    throw new ApiError(400, "Only active members can make bookings");
  }

  let amount = base_amount;
  if (member.is_trial_user && !member.converted_from_trial) {
    amount *= 0.8; // 20% trial discount
  }
  amount = applyCoupon(amount, coupon_code?.toUpperCase());

  const existing = await Booking.findOne({ venue_id, booking_date });
  if (existing) {
    throw new ApiError(409, "Venue already booked at this time slot");
  }

  const booking = await Booking.create({
    venue_id,
    sport_id,
    member_id,
    booking_date,
    amount,
    coupon_code: coupon_code?.toUpperCase() || "",
    status: "Confirmed",
  });

  await Transaction.create({
    booking_id: booking._id,
    type: "Booking",
    amount,
    status: "Success",
    transaction_date: new Date(),
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate("venue_id", "name location")
    .populate("sport_id", "name")
    .populate("member_id", "name");

  res
    .status(201)
    .json(
      new ApiResponse(201, "Booking created successfully", populatedBooking)
    );
});

export const updateBooking = asyncHandler(async (req, res) => {
  const updates = req.body;
  const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate("venue_id", "name location")
    .populate("sport_id", "name")
    .populate("member_id", "name");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Booking updated successfully", booking));
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  booking.status = "Cancelled";
  await booking.save();

  const transaction = await Transaction.findOne({ booking_id: req.params.id });
  if (transaction) {
    transaction.status = "Refunded";
    await transaction.save();
  }

  await Booking.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Booking cancelled and refunded successfully"));
});
