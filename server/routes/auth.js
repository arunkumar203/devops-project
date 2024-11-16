//routes/auth.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fetchUser = require("../middleware/fetchUser");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");  // <-- Correct import

const JWT_SECRET = "Sathwik143"; // Replace this with a more secure JWT secret in production

// Route 1: Create a User using: POST "/api/auth/createuser". Doesn't require Auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name"),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password"),
    body("userid", "Enter a valid userid").isNumeric(), // Validate userid
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Checking if the email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Checking if the userid already exists
      user = await User.findOne({ userid: req.body.userid });
      if (user) {
        return res.status(400).json({ error: "User ID already exists" });
      }

      // Hash the password
      let salt = await bcrypt.genSalt(10);
      let secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user with userid from request
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        userid: req.body.userid, // Use the provided userid
        courseid_list: [], // Initially empty course list
      });

      // Save the user
      await user.save();

      // Prepare JWT token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken, success: true,user:user.id });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Some error occurred");
    }
  }
);

// Route 2: Authenticating a User using: POST "/api/auth/login". Doesn't require Auth
router.post(
  "/login",
  [
    body("email", "Password cannot be blank").isEmail(),
    body("password", "Enter a valid password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          error: "Please try to login with correct credentials alpha",
        });
      }

      // Compare the password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials beta" });
      }

      // Prepare JWT token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken, success: true,user:user.id });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Get logged-in user details: POST "/api/auth/getuser". login is required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // Exclude password
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
