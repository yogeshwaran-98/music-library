import { mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Editor", "Viewer"],
    default: "Viewer",
  },
});

export default mongoose.model("User", userSchema);
