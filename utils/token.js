import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
  const payload = { userId, role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });
};
