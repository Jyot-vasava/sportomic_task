// src/middleware/errorHandler.js
import ApiError from "../utils/apiError";

const errorHandler = (err, req, res, next) => {
  // If it's our custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // Default to 500 server error
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    errors: [err.message || "Internal Server Error"],
  });
};

export default errorHandler;
