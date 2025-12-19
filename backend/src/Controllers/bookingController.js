// src/Controllers/bookingController.js
import { Booking } from "../Models/Booking.js";
import { Venue } from "../Models/Venue.js";
import { Sport } from "../Models/Sport.js";
import { Member } from "../Models/Member.js";
import { Transaction } from "../Models/Transaction.js";

// Simple coupon discount function
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

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("venue_id", "name location")
      .populate("sport_id", "name")
      .populate("member_id", "name");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("venue_id", "name location")
      .populate("sport_id", "name")
      .populate("member_id", "name");
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const {
      venue_id,
      sport_id,
      member_id,
      booking_date,
      base_amount,
      coupon_code,
    } = req.body;

    // Validate existence
    const venue = await Venue.findById(venue_id);
    const sport = await Sport.findById(sport_id);
    const member = await Member.findById(member_id);
    if (!venue || !sport || !member) {
      return res.status(400).json({ error: "Invalid venue, sport, or member" });
    }

    // Edge case: Active member only
    if (member.status !== "Active") {
      return res.status(400).json({ error: "Member must be active to book" });
    }

    // Edge case: Trial discount
    let amount = base_amount;
    if (member.is_trial_user && !member.converted_from_trial) {
      amount *= 0.8;
    }
    amount = applyCoupon(amount, coupon_code);

    // Edge case: Check availability
    const existing = await Booking.findOne({ venue_id, booking_date });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Venue already booked at this time" });
    }

    const booking = new Booking({
      venue_id,
      sport_id,
      member_id,
      booking_date,
      amount,
      coupon_code: coupon_code || "",
      status: "Confirmed",
    });
    await booking.save();

    // Create transaction
    const transaction = new Transaction({
      booking_id: booking._id,
      type: "Booking",
      amount,
      status: "Success",
      transaction_date: new Date(),
    });
    await transaction.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { status, amount, coupon_code } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, amount, coupon_code },
      { new: true, runValidators: true }
    )
      .populate("venue_id", "name location")
      .populate("sport_id", "name")
      .populate("member_id", "name");
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update status to Cancelled
    booking.status = "Cancelled";
    await booking.save();

    // Edge case: Refund transaction
    const transaction = await Transaction.findOne({
      booking_id: req.params.id,
    });
    if (transaction) {
      transaction.status = "Refunded";
      await transaction.save();
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled and refunded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
