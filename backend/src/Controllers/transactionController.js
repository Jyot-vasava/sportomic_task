// src/Controllers/transactionController.js
import { Transaction } from "../Models/Transaction.js";
import { Booking } from "../Models/Booking.js";

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("booking_id", "amount status booking_date")
      .sort({ transaction_date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "booking_id",
      "amount status booking_date"
    );
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { booking_id, type, amount, status } = req.body;

    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(400).json({ error: "Invalid booking" });
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

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { type, amount, status } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, amount, status },
      { new: true }
    ).populate("booking_id", "amount status");
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
