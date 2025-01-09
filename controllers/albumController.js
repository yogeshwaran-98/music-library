import Album from "../models/albumModel.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
import Artist from "../models/artistModel.js";
import mongoose from "mongoose";

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        message: "Bad Request: Invalid User ID",
        error: null,
      });
    }

    const album = await Album.findById(id);
    if (!album) {
      return res
        .status(404)
        .json({ data: null, message: "Resource doent exist", error: null });
    }

    return res.status(200).json({
      data: album,
      message: "Album fetched successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const addAlbum = async (req, res, next) => {
  try {
    const { name, year, hidden = false, artist_id } = req.body;

    if (!artist_id || !name || !year || hidden === undefined) {
      return res
        .status(400)
        .json({ data: null, message: "Bad Request", error: null });
    }

    const artist = await Artist.findById(artist_id);
    if (!artist) {
      return res
        .status(404)
        .json({ data: null, message: ": Resource Doesn't Exist", error: null });
    }

    const album = new Album({ name, year, hidden, artist: artist_id });
    await album.save();
    res
      .status(201)
      .json({ data: null, message: "Album created successfully", error: null });
  } catch (err) {
    next(err);
  }
};

export const getAlbums = async (req, res, next) => {
  try {
    const { limit = 5, offset = 0, artist_id = 0, hidden = false } = req.query;
    if (
      isNaN(limit) ||
      isNaN(offset) ||
      isNaN(artist_id) ||
      limit < 0 ||
      offset < 0 ||
      artist_id < 0
    ) {
      return res
        .status(400)
        .json({ data: null, message: "Bad Request", error: null });
    }

    const query = {};
    if (artist_id) {
      query.artist_id = artist_id;
    }

    if (hidden != undefined) {
      query.hidden = hidden === "true";
    }

    const albums = await Album.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    res.status(200).json({
      data: albums,
      message: "Albums fetched successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const { name, year, hidden = false } = req.body;
    const { id } = req.params;

    if (
      !id ||
      !name ||
      !year ||
      !mongoose.Types.ObjectId.isValid(id) ||
      isNaN(year)
    ) {
      return res.status(400).json({
        data: null,
        message: "Bad Request: Invalid input",
        error: null,
      });
    }

    const album = await Album.findByIdAndUpdate(
      id,
      {
        name,
        year,
        hidden,
      },
      { new: true }
    );

    if (!album) {
      return res
        .status(404)
        .json({ data: null, message: "Resource doesn't exist", error: null });
    }

    return res.status(200).json({
      data: album,
      message: "Album updated successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        message: "Bad Request: Invalid User ID",
        error: null,
      });
    }

    const album = await Album.findById(id);
    const albumName = album.name;
    const deleteAlbum = await Album.findByIdAndDelete(id);
    if (!deleteAlbum) {
      return res
        .status(404)
        .json({ data: null, message: ": Resource Doesn't Exist", error: null });
    }

    return res.status(200).json({
      data: null,
      message: `Album: ${albumName} deleted successfully`,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
