// src/controllers/venuecontroller.js
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import { Venue } from "../models/Venue";

export const getAllVenues = asyncHandler(async (req, res) => {
  const venues = await Venue.find().select("name location");
  res
    .status(200)
    .json(new ApiResponse(200, "Venues fetched successfully", venues));
});

export const getVenueById = asyncHandler(async (req, res) => {
  const venue = await Venue.findById(req.params.id).select("name location");
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Venue fetched successfully", venue));
});

export const createVenue = asyncHandler(async (req, res) => {
  const { name, location } = req.body;
  const venue = new Venue({ name, location });
  await venue.save();
  res
    .status(201)
    .json(new ApiResponse(201, "Venue created successfully", venue));
});

export const updateVenue = asyncHandler(async (req, res) => {
  const { name, location } = req.body;
  const venue = await Venue.findByIdAndUpdate(
    req.params.id,
    { name, location },
    { new: true, runValidators: true }
  );
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Venue updated successfully", venue));
});

export const deleteVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findByIdAndDelete(req.params.id);
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }
  res.status(200).json(new ApiResponse(200, "Venue deleted successfully"));
});
