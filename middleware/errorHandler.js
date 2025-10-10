export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "SERVER ERROR",
    // stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
