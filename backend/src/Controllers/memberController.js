// src/Controllers/memberController.js
import { Member } from "../Models/Member.js";

export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().select(
      "name status is_trial_user converted_from_trial join_date"
    );
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select(
      "name status is_trial_user converted_from_trial join_date"
    );
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const { name, status, is_trial_user, converted_from_trial, join_date } =
      req.body;
    const member = new Member({
      name,
      status,
      is_trial_user,
      converted_from_trial,
      join_date,
    });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { name, status, is_trial_user, converted_from_trial, join_date } =
      req.body;
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { name, status, is_trial_user, converted_from_trial, join_date },
      { new: true, runValidators: true }
    );
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json({ message: "Member deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
