import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: String,
  password: String
});

export const User = mongoose.model("user", userSchema);
