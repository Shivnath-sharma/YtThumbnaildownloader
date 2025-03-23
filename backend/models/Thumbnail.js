const mongoose = require('mongoose');

const thumbnailSchema = mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true
    },
    thumbnailUrl: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date, // Expiry time for the link
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Thumbnail = mongoose.model('Thumbnail', thumbnailSchema);

module.exports = Thumbnail;
