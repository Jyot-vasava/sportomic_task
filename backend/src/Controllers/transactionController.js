// src/controllers/transactioncontroller.js
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import { Transaction } from "../models/Transaction";
import { Booking } from "../Models/Booking";

export const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
    .populate("booking_id", "amount status booking_date")
    .sort({ transaction_date: -1 });
  res
    .status(200)
    .json(
      new ApiResponse(200, "Transactions fetched successfully", transactions)
    );
});

export const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate(
    "booking_id",
    "amount status booking_date"
  );
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "Transaction fetched successfully", transaction)
    );
});

export const createTransaction = asyncHandler(async (req, res) => {
  const { booking_id, type, amount, status } = req.body;

  const booking = await Booking.findById(booking_id);
  if (!booking) {
    throw new ApiError(400, "Invalid booking");
  }

  const transaction = new Transaction({
    booking_id,
    type: type || "Booking",
    amount: amount || booking.amount,
    status: status || "Success",
    transaction_date: new Date(),
  });
  await transaction.save();

  if (status === "Dispute") {
    booking.status = "Cancelled";
    await booking.save();
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, "Transaction created successfully", transaction)
    );
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const { type, amount, status } = req.body;
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    { type, amount, status },
    { new: true }
  ).populate("booking_id", "amount status");
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, "Transaction updated successfully", transaction)
    );
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Transaction deleted successfully"));
});
