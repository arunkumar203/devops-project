// middleware/fetchUser.js

var jwt = require("jsonwebtoken");
const JWT_SECRET = "Sathwik143"; // Make sure to use environment variables for production

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");

  // If token is missing, return the response and stop further execution
  if (!token) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  try {
    // Verify token
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user; // Attach the user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // In case of any verification issues, send error response
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchUser;
