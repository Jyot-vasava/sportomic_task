// src/controllers/statsController.js
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import { Member } from "../models/Member";
import { Venue } from "../models/Venue";
import { Booking } from "../Models/Booking";
import { Transaction } from "../models/Transaction";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const activeMembers = await Member.countDocuments({ status: "Active" });
  const inactiveMembers = await Member.countDocuments({ status: "Inactive" });
  const trialUsers = await Member.countDocuments({ is_trial_user: true });
  const convertedFromTrial = await Member.countDocuments({
    converted_from_trial: true,
  });
  const totalVenues = await Venue.countDocuments();

  const avgBookingAmountResult = await Booking.aggregate([
    { $match: { status: { $ne: "Cancelled" } } },
    { $group: { _id: null, avg: { $avg: "$amount" } } },
  ]);
  const avgBookingAmount = avgBookingAmountResult[0]?.avg || 0;

  const revenueResult = await Transaction.aggregate([
    { $match: { status: "Success" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const revenueGenerated = revenueResult[0]?.total || 0;

  const stats = {
    activeMembers,
    inactiveMembers,
    trialUsers,
    convertedFromTrial,
    totalVenues,
    avgBookingAmount: avgBookingAmount.toFixed(2),
    revenueGenerated: revenueGenerated.toFixed(2),
  };

  res
    .status(200)
    .json(new ApiResponse(200, "Dashboard stats fetched successfully", stats));
});
