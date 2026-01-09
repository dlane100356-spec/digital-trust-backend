const jwt = require("jsonwebtoken");

/**
 * JWT Authentication Middleware
 * Expects header:
 * Authorization: Bearer <JWT_TOKEN>
 */
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      message: "Authorization header missing",
    });
  }

  // Check Bearer format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Invalid authorization format",
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "Token missing",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request
    req.user = decoded;

    // Continue to next middleware / route
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token",
    });
  }
};
