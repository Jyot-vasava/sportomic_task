// src/controllers/membercontroller.js
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import { Member } from "../odels/Member";

export const getAllMembers = asyncHandler(async (req, res) => {
  const members = await Member.find().select(
    "name status is_trial_user converted_from_trial join_date"
  );
  res
    .status(200)
    .json(new ApiResponse(200, "Members fetched successfully", members));
});

export const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id).select(
    "name status is_trial_user converted_from_trial join_date"
  );
  if (!member) throw new ApiError(404, "Member not found");
  res
    .status(200)
    .json(new ApiResponse(200, "Member fetched successfully", member));
});

export const createMember = asyncHandler(async (req, res) => {
  const member = await Member.create(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, "Member created successfully", member));
});

export const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!member) throw new ApiError(404, "Member not found");
  res
    .status(200)
    .json(new ApiResponse(200, "Member updated successfully", member));
});

export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id);
  if (!member) throw new ApiError(404, "Member not found");
  res.status(200).json(new ApiResponse(200, "Member deleted successfully"));
});
