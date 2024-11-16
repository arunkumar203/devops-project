//models/Course.js

const mongoose = require("mongoose");
const { Schema } = mongoose;
const { body, validationResult } = require("express-validator");

const courseSchema = new Schema({
  courseid: {
    type: String,
    unique: true,
    required: true, // course ID must be provided by the creator
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  enroll_list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: []
    },
  ],
});

module.exports = mongoose.model("course", courseSchema);