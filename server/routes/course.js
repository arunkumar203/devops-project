//routes/course.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Course = require("../models/Course");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
const User = require('../models/User'); // Adjust this path as needed

// Route 1: Create a new course - POST /api/courses/create
router.post(
  "/create",
  [
    body("courseid", "Course ID is required").notEmpty(),
    body("title", "Course title is required").notEmpty(),
    body("desc", "Course description is required").notEmpty(),
    body("instructor", "Instructor name is required").notEmpty(),
    body("semester", "Semester is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseid, title, desc, instructor, semester } = req.body;

    try {
      // Check if the course already exists
      let course = await Course.findOne({ courseid });
      if (course) {
        return res.status(400).json({ error: "Course with this ID already exists" });
      }

      // Create a new course
      course = new Course({
        courseid,
        title,
        desc,
        instructor,
        semester,
      });

      await course.save();
      res.json({ success: true, course });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2: Get all courses - GET /api/courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 3: Get a single course by courseid - GET /api/courses/:courseid
router.get("/:courseid", async (req, res) => {
  try {
    const course = await Course.findOne({ courseid: req.params.courseid });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Update a course by courseid - PUT /api/courses/:courseid
router.put(
  "/:courseid",
  [
    body("title", "Course title is required").optional().notEmpty(),
    body("desc", "Course description is required").optional().notEmpty(),
    body("instructor", "Instructor name is required").optional().notEmpty(),
    body("semester", "Semester is required").optional().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, desc, instructor, semester } = req.body;

    try {
      const course = await Course.findOne({ courseid: req.params.courseid });
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Update fields
      if (title) course.title = title;
      if (desc) course.desc = desc;
      if (instructor) course.instructor = instructor;
      if (semester) course.semester = semester;

      await course.save();
      res.json({ success: true, course });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 5: Delete a course by courseid - DELETE /api/courses/:courseid
router.delete("/:courseid", async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ courseid: req.params.courseid });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});


// Route 6: Enroll a user in a course - POST /api/courses/enroll/:courseid (requires login)
router.post("/enroll/:courseid", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    
    const courseId = req.params.courseid;
    console.log("courseId");
    // Find the user
    const user = await User.findById(userId);
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the course
    const course = await Course.findOne({ courseid: courseId });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the user is already enrolled
    if (course.enroll_list.includes(user._id)) {
      return res
        .status(400)
        .json({ error: "User is already enrolled in this course" });
    }

    // Enroll the user in the course
    course.enroll_list.push(user._id);
    await course.save();

    // Add the course to the user's courseid_list
    user.courseid_list.push(course._id);
    await user.save();

    res.json({
      success: true,
      message: "User successfully enrolled in the course",
      course,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
