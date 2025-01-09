import express from "express";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favouriteController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:category", checkAuth, getFavorites);
router.post("/add-favorite", checkAuth, addFavorite);
router.delete("/remove-favorite/:id", checkAuth, removeFavorite);

export default router;
