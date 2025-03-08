const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  faceDescriptor: { type: [Number], required: true }, // Storing descriptor as an array
  lastActive: { type: Date, default: Date.now } // Store last login timestamp
});

const User = mongoose.model("User", userSchema);

module.exports = User;
