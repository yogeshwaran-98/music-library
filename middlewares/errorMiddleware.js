export default (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorDetails = err.details || null;

  res.status(statusCode).json({
    status: statusCode,
    data: null,
    message,
    error: errorDetails,
  });
};
