import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bookingRoutes from "./routes/bookingRoutes";
import memberRoutes from "./routes/memberRoutes";
import sportRoutes from "./routes/sportRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import venueRoutes from "./routes/venueRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Adjust for production
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/stats", statsRoutes);


import errorHandler from "./Middleware/errorHandler";
app.use(errorHandler);

export default app;

