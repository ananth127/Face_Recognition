const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Euclidean Distance Calculation
const euclideanDistance = (desc1, desc2) => {
  if (desc1.length !== desc2.length) return Infinity;
  return Math.sqrt(desc1.reduce((sum, val, i) => sum + (val - desc2[i]) ** 2, 0));
};

// Register Face
router.post("/register", async (req, res) => {
  const { username, faceDescriptor } = req.body;

  if (!username || !faceDescriptor) {
    return res.status(400).json({ message: "Username and face descriptor required!" });
  }

  try {
    const newUser = new User({ username, faceDescriptor });
    await newUser.save();
    res.json({ message: "✅ Face registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving face data", error: err });
  }
});

// Login (Face Matching)
router.post("/login", async (req, res) => {
  const { faceDescriptor } = req.body;

  if (!faceDescriptor) {
    return res.status(400).json({ message: "Face descriptor required!" });
  }

  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(400).json({ message: "No registered faces found." });
    }

    let bestMatch = null;
    let bestDistance = Infinity;

    users.forEach((user) => {
      const storedDescriptor = new Float32Array(user.faceDescriptor);
      const distance = euclideanDistance(storedDescriptor, new Float32Array(faceDescriptor));

      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = user;
      }
    });

    if (bestMatch && bestDistance < 0.5) {
      // Update last active timestamp
      bestMatch.lastActive = new Date();
      await bestMatch.save();

      res.json({ 
        message: "✅ Face Matched!", 
        username: bestMatch.username, 
        lastActive: bestMatch.lastActive 
      });
    } else {
      res.status(401).json({ message: "❌ Face does not match!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error processing face data", error: err });
  }
});


module.exports = router;
