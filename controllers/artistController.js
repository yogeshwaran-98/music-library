import Artist from "../models/artistModel.js";
import mongoose from "mongoose";

export const addArtist = async (req, res, next) => {
  try {
    const { name, grammy, hidden = false } = req.body;
    if (!name || typeof grammy !== "boolean") {
      return res.status(400).json({
        data: null,
        message: "Bad Request from controller",
        error: null,
      });
    }
    const artist = new Artist({ name, grammy, hidden });
    await artist.save();
    res.status(201).json({
      data: null,
      message: "Artist created successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getArtists = async (req, res, next) => {
  try {
    const { limit = 5, offset = 0, grammy = false, hidden = true } = req.query;

    if (isNaN(limit) || isNaN(offset) || limit < 0 || offset < 0) {
      return res
        .status(400)
        .json({ data: null, message: "Bad Request", error: null });
    }

    const query = {};
    if (grammy) query.grammy = Boolean(grammy);
    if (hidden !== undefined) query.hidden = hidden === "true";

    const artists = await Artist.find(query)
      .limit(Number(limit))
      .skip(Number(offset));
    res.status(200).json({
      data: artists,
      message: "Artists fetched successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getArtistById = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist)
      return res
        .status(404)
        .json({ data: null, message: "Artist not found", error: null });
    res.status(200).json({
      data: artist,
      message: "Artist fetched successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        message: "Bad Request: Invalid User ID",
        error: null,
      });
    }

    const { name, grammy, hidden = false } = req.body;
    if (!name || typeof grammy != "boolean") {
      return res.status(400).json({
        data: null,
        message: "Bad request",
        error: null,
      });
    }

    const updatedDetails = {
      name,
      grammy,
      hidden,
    };

    const artist = await Artist.findByIdAndUpdate(id, updatedDetails, {
      new: true,
    });
    if (!artist)
      return res
        .status(404)
        .json({ data: null, message: "Artist not found", error: null });

    res.status(204).json({
      data: null,
      message: "Artist updated successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        message: "Bad Request: Invalid User ID",
        error: null,
      });
    }
    const getArtist = await Artist.findById(id);
    const artist_name = getArtist.name;

    const artist = await Artist.findByIdAndDelete(id);
    if (!artist)
      return res
        .status(404)
        .json({ data: null, message: "Artist not found", error: null });
    res.status(200).json({
      data: null,
      message: `Artist:${artist_name} deleted successfully`,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
