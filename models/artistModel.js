import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grammy: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
});

export default mongoose.model("Artist", artistSchema);
