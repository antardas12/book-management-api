// middlewares/errorHandler.js

import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error d";

  if (err instanceof ApiError) {
    statusCode = err.statusCode || 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: err.data || null,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
