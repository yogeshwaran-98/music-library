import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(decoded.userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "Your account not found !! Register again" });

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};

export const checkAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res
      .status(403)
      .json({ message: "Forbidden Access/Operation not allowed." });
  }
  next();
};

export const checkEditor = (req, res, next) => {
  const userRole = req.user.role;

  if (userRole === "Editor" || userRole === "Admin") {
    return next();
  }

  return res.status(403).json({
    status: 403,
    message:
      "Permission denied. You must be an Editor or Admin to perform this action.",
    error: "Forbidden",
  });
};
