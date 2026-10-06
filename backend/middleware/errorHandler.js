const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  // PostgreSQL unique constraint violation (e.g. duplicate email)
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'A record with this information already exists.',
      error: err.detail,
    });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist.',
      error: err.detail,
    });
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    return res.status(400).json({
      success: false,
      message: 'Provided value violated database constraints.',
    });
  }

  // Default internal server error
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
