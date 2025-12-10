import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Use existing model if it exists (avoids OverwriteModelError on reload)
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
