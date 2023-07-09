const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const scissorsSchema = new mongoose.Schema(
  {
    fullUrl: {
      type: String,
      required: true,
      unique: true,
    },

    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: ObjectId,
      required: true,
    },

    clicks: {
      type: Number,
      required: true,
      default: 0,
    },

    customUrl: {
      type: String,
      unique: true,
    },
  },
  { timestamps: {} }
);

module.exports = mongoose.model("scissors", scissorsSchema);
