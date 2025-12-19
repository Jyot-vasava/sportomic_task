// src/Controllers/sportController.js
import { Sport } from "../Models/Sport.js";

export const getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find().select("name");
    res.json(sports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSportById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id).select("name");
    if (!sport) {
      return res.status(404).json({ error: "Sport not found" });
    }
    res.json(sport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSport = async (req, res) => {
  try {
    const { name } = req.body;
    const sport = new Sport({ name });
    await sport.save();
    res.status(201).json(sport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSport = async (req, res) => {
  try {
    const { name } = req.body;
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!sport) {
      return res.status(404).json({ error: "Sport not found" });
    }
    res.json(sport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findByIdAndDelete(req.params.id);
    if (!sport) {
      return res.status(404).json({ error: "Sport not found" });
    }
    res.json({ message: "Sport deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
