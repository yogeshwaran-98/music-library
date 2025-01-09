import express from "express";
import {
  addArtist,
  getArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
} from "../controllers/artistController.js";
import { checkAuth, checkAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-artist", checkAuth, checkAdmin, addArtist);
router.get("/", checkAuth, getArtists);
router.get("/:id", checkAuth, getArtistById);
router.put("/:id", checkAuth, checkAdmin, updateArtist);
router.delete("/:id", checkAuth, checkAdmin, deleteArtist);

export default router;
