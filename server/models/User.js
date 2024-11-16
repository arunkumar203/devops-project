//models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  userid: {
    type: Number,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  courseid_list: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "course",
    default: [],  // Set default to null
  },
  name: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);
// User.createIndexes();
module.exports = User;
