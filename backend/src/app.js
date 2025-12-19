import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes (you'll need to create these route files)
import bookingRoutes from "./Routes/bookingRoutes.js";
import memberRoutes from "./Routes/memberRoutes.js";
import sportRoutes from "./Routes/sportRoutes.js";
import venueRoutes from "./Routes/venueRoutes.js";
import transactionRoutes from "./Routes/transactionRoutes.js";

// Use routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;
