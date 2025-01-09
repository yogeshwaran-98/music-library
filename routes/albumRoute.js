import express from "express";
import {
  addAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
} from "../controllers/albumController.js";
import {
  checkAuth,
  checkAdmin,
  checkEditor,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-album", checkAuth, checkEditor, addAlbum);
router.get("/", checkAuth, getAlbums);
router.get("/:id", checkAuth, getAlbumById);
router.put("/:id", checkAuth, checkEditor, updateAlbum);
router.delete("/:id", checkAuth, checkAdmin, deleteAlbum);

export default router;
