const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userValidation = require("../validation/userValidation");
const userModel = require("../Model/UserModel");
const generateToken = require("../utils/generateToken");


router.post("/signup", async (req, res, next) => {
  try {
    // Validate incoming data
    const { error } = userValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Please enter the data correctly",
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new userModel({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "User created successfully",
      token,
      data: user,
    });
  } catch (err) {
    return next(err);
  }
});


router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      const err = new Error("User not found");
      err.status = 400;
      return next(err);
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Wrong Password");
      err.status = 400;
      return next(err);
    }

  
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;