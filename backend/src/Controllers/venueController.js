// src/Controllers/venueController.js
import { Venue } from "../Models/Venue.js";

export const getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find().select("name location");
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).select("name location");
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createVenue = async (req, res) => {
  try {
    const { name, location } = req.body;
    const venue = new Venue({ name, location });
    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateVenue = async (req, res) => {
  try {
    const { name, location } = req.body;
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { new: true, runValidators: true }
    );
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.json(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.json({ message: "Venue deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
