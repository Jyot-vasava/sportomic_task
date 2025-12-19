// src/Routes/sportRoutes.js
import express from "express";
import {
  getAllSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
} from "../Controllers/sportController.js";

const router = express.Router();

router.get("/", getAllSports);
router.get("/:id", getSportById);
router.post("/", createSport);
router.put("/:id", updateSport);
router.delete("/:id", deleteSport);

export default router;
