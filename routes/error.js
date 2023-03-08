function notFound(req, res, next) {
  res.status(404);
  const error = new Error("Page not Found");
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  // console.log(err.stack);
  res.json({
    message: err.message,
    // stack: err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
