import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  hidden: { type: Boolean, default: false },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
});

export default mongoose.model("Track", trackSchema);
