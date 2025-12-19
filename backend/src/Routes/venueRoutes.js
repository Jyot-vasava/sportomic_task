// src/Routes/venueRoutes.js
import express from "express";
import {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
} from "../Controllers/venueController.js";

const router = express.Router();

router.get("/", getAllVenues);
router.get("/:id", getVenueById);
router.post("/", createVenue);
router.put("/:id", updateVenue);
router.delete("/:id", deleteVenue);

export default router;
