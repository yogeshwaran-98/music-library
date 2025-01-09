import bcrypt from "bcrypt";
import User from "../models/userModel.js";

import mongoose from "mongoose";

export const getUsers = async (req, res, next) => {
  try {
    const { limit = 5, offset = 0, role = "" } = req.query;

    if (isNaN(limit) || isNaN(offset) || limit < 0 || offset < 0) {
      return res
        .status(400)
        .json({ data: null, message: "Bad Request", error: null });
    }

    const query = {};
    if (role) {
      if (role == "Viewer" || role == "Editor") {
        query.role = role;
      } else {
        return res
          .status(400)
          .json({ data: null, message: "Invalid role included", error: null });
      }
    }

    const users = await User.find(query)
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    const totalUsers = await User.countDocuments(query);

    return res.status(200).json({
      status: 200,
      data: {
        users,
        pagination: {
          totalUsers,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      },
      message: "Users retrieved successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const addUser = async (req, res, next) => {
  try {
    // const { error } = validateAddUser(req.body);
    // if (error)
    //   return res
    //     .status(400)
    //     .json({ data: null, message: error.details[0].message, error: null });

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ data: null, message: "Bad Request", error: null });
    }

    const allRoles = ["Admin", "Viewer", "Editor"];
    if (!allRoles.includes(role)) {
      return res
        .status(400)
        .json({ data: null, message: "Bad Request", error: null });
    }

    const userExist = await User.findOne({ email });
    if (userExist)
      return res
        .status(409)
        .json({ data: null, message: "Email already exists", error: null });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await User.countDocuments();
    const userRole = userCount === 0 ? "Admin" : role;

    const newUser = new User({
      email,
      password: hashedPassword,
      role: userRole,
    });
    await newUser.save();

    if (userRole == "Admin") {
      res.status(201).json({
        data: null,
        message: "Admin created successfully",
        error: null,
      });
    }

    res
      .status(201)
      .json({ data: null, message: "User created successfully", error: null });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        message: "Bad Request: Invalid User ID",
        error: null,
      });
    }

    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ data: null, message: "User not found", error: null });

    // if (user.role === "Admin")
    //   return res.status(403).json({ message: "Cannot delete another Admin" });

    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ data: null, message: "User deleted successfully", error: null });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    // const { error } = validatePasswordUpdate(req.body);
    // if (error)
    //   return res
    //     .status(400)
    //     .json({ data: null, message: error.details[0].message, error: null });

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res
        .status(400)
        .json({ data: null, message: "Bad Request", error: null });
    }
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ data: null, message: "User not found", error: null });

    const isPasswordValid = await bcrypt.compare(old_password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({
        data: null,
        message: "Old password is incorrect",
        error: null,
      });

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    res.status(204).json({
      data: null,
      message: "Password updated successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
