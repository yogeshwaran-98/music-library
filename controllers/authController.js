import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

import { generateToken } from "../utils/token.js";

export const signup = async (req, res, next) => {
  try {
    // const { error } = validateSignup(req.body);
    // if (error)
    //   return res.status(400).json({ message: error.details[0].message });

    const requiredFields = ["email", "password"];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          data: null,
          message: `Bad Request, Reason: ${field} is missing`,
          error: null,
        });
      }
    }

    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist)
      return res
        .status(409)
        .json({ data: null, message: "Email already exists", error: null });

    const hashedPassword = await bcrypt.hash(password, 10);

    const isAdmin = (await User.countDocuments()) === 0;
    const role = isAdmin ? "Admin" : "Viewer";

    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res
      .status(201)
      .json({ data: null, message: "User created successfully", error: null });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    // const { error } = validateLogin(req.body);
    // if (error)
    //   return res.status(400).json({ message: error.details[0].message });

    const requiredFields = ["email", "password"];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          data: null,
          message: `Bad Request, Reason: ${field} is missing`,
          error: null,
        });
      }
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ data: null, message: "User not found", error: null });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res
      .status(200)
      .json({ data: token, message: "Login successful", error: null });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  try {
    res.status(200).json({
      data: null,
      message: "User logged out successfully",
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ data: null, message: "Bad Request", error: null });
  }
};
