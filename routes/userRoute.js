import express from "express";
import {
  addUser,
  deleteUser,
  getUsers,
  updatePassword,
} from "../controllers/userController.js";
import { checkAuth, checkAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", checkAuth, checkAdmin, getUsers);
router.post("/add-user", checkAuth, checkAdmin, addUser);
router.delete("/:id", checkAuth, checkAdmin, deleteUser);
router.put("/update-password", checkAuth, updatePassword);

export default router;
