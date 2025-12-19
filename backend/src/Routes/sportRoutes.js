import express from "express";
import {
  getAllSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
} from "../controllers/sportcontroller";

const router = express.Router();

router.get("/", getAllSports);
router.get("/:id", getSportById);
router.post("/", createSport);
router.put("/:id", updateSport);
router.delete("/:id", deleteSport);

export default router;
