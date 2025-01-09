import Track from "../models/trackModel.js";
import mongoose from "mongoose";

export const getTrackById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ data: null, message: "Bad request", error: null });
    }

    const track = await Track.findById(id);

    if (!track) {
      return res
        .status(404)
        .json({ data: null, message: "Resource doesn't exist", error: null });
    }

    return res.status(200).json({
      data: track,
      message: "Track fetched successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const addTrack = async (req, res, next) => {
  try {
    const { name, duration, hidden = false, album_id, artist_id } = req.body;
    if (
      !name ||
      !duration ||
      !album_id ||
      !artist_id ||
      !mongoose.Types.ObjectId.isValid(album_id) ||
      !mongoose.Types.ObjectId.isValid(artist_id) ||
      album_id < 0 ||
      artist_id < 0
    ) {
      return res
        .status(400)
        .json({ data: null, message: "Bad request", error: null });
    }
    const track = new Track({
      name,
      duration,
      hidden,
      album: album_id,
      artist: artist_id,
    });
    await track.save();
    res
      .status(201)
      .json({ data: null, message: "Track added successfully", error: null });
  } catch (err) {
    next(err);
  }
};

export const getTracks = async (req, res, next) => {
  try {
    const tracks = await Track.find();
    res.status(200).json({
      data: tracks,
      message: "Tracks fetched successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTrack = async (req, res, next) => {
  try {
    const { name, duration, hidden = false } = req.body;
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id) || !name || !duration) {
      return res
        .status(400)
        .json({ data: null, message: "Bad request", error: null });
    }

    const track = await Track.findByIdAndUpdate(
      id,
      {
        name,
        duration,
        hidden,
      },
      { new: true, runValidators: true }
    );

    if (!track) {
      return res
        .status(404)
        .json({ data: null, message: "Resource doesn't exist", error: null });
    }

    return res.status(200).json({
      data: track,
      message: "Track updated successfully",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTrack = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ data: null, message: "Bad request", error: null });
    }

    const getTrack = await Track.findById(id);
    const trackName = getTrack.name;

    const track = await Track.findByIdAndDelete(id);

    if (!track) {
      return res
        .status(404)
        .json({ data: null, message: "Resorce doesn't exist" });
    }

    return res.status(200).json({
      data: null,
      message: `Track:${trackName} deleted successfully`,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
