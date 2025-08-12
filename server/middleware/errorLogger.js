export const errorLogger = (err, req, res, next) => {
  console.error("\x1b[31m", "--- ERROR ---"); // Red color
  console.error("\x1b[31m", "Timestamp:", new Date().toISOString());
  console.error("\x1b[31m", "Request URL:", req.originalUrl);
  console.error("\x1b[31m", "Error Stack:", err.stack);
  console.error("\x1b[31m", "--- END ERROR ---", "\x1b[0m");
  next(err);
};

export const errorResponder = (err, req, res, next) => {
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
