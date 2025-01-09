import Favorite from "../models/favouriteModel.js";
import mongoose from "mongoose";

export const getFavorites = async (req, res, next) => {
  try {
    const { category = "", limit = 5, offset = 0 } = req.body;
    const id = req.user.userId;
    console.log(id);
    if (
      !id ||
      !mongoose.Types.ObjectId.isValid(id) ||
      isNaN(limit) ||
      limit < 0 ||
      isNaN(offset) ||
      offset < 0
    ) {
      return res
        .status(400)
        .json({ data: null, message: "Bad requests", error: null });
    }

    const query = {};
    if (category) {
      query.category = category;
    }

    const myFavourites = await Favorite.find({ userId: id, ...query })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    if (myFavourites.length == 0) {
      return res
        .status(200)
        .json({ data: null, message: "No Favorites found", error: null });
    }

    return res.status(200).json({
      data: myFavourites,
      message: "Favourites fetched successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { category, item_id } = req.body;
    const userId = req.user.userId;

    if (!category || !item_id || !mongoose.Types.ObjectId.isValid(item_id)) {
      return res
        .status(400)
        .json({ data: null, message: "Bad requests 1st", error: null });
    }

    const validCategories = ["Artist", "Album", "Track"];

    if (!validCategories.includes(category)) {
      return res
        .status(400)
        .json({ data: null, message: "Bad requests 2nd", error: null });
    }

    const favorite = new Favorite({ userId, category, item_id });
    await favorite.save();

    res.status(201).json({
      data: favorite,
      message: "Favorite added successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ data: null, message: "Bad requests", error: null });
    }
    await Favorite.findByIdAndDelete(id);

    res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
};
