import express from "express";
import { getDashboardStats } from "../Controllers/statsController";

const router = express.Router();

router.get("/", getDashboardStats);

export default router;
