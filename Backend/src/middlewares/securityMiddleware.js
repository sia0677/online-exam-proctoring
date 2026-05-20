// A placeholder for custom security middlewares, e.g., sanitizing NoSQL injections
// This will be expanded later if we install packages like express-mongo-sanitize

const securityMiddleware = (req, res, next) => {
  // Example: simple check to prevent some obvious patterns, but usually handled by libraries
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string' && req.body[key].includes('$where')) {
        return res.status(400).json({ success: false, error: 'Invalid input data' });
      }
    }
  }
  next();
};

module.exports = securityMiddleware;
