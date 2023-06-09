const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
  },
  { timestamps: {} }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
