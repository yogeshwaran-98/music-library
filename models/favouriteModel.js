import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["Artist", "Album", "Track"],
    required: true,
  },
  item_id: { type: mongoose.Schema.Types.ObjectId, required: true },
});

export default mongoose.model("Favorite", favoriteSchema);
