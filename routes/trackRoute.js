import express from "express";
import {
  addTrack,
  getTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
} from "../controllers/trackController.js";
import {
  checkAdmin,
  checkAuth,
  checkEditor,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-track", checkAuth, checkEditor, addTrack);
router.get("/", checkAuth, getTracks);
router.get("/:id", checkAuth, getTrackById);
router.put("/:id", checkAuth, checkEditor, updateTrack);
router.delete("/:id", checkAuth, checkAdmin, deleteTrack);

export default router;
