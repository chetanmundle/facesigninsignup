import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    required: [true, "username is required !!"],
    unique: true,
  },
  password: String,
  img1: String,
  img2: String,
});

// model of the above schema
export const User =
  mongoose.models.users || mongoose.model("users", userSchema);
