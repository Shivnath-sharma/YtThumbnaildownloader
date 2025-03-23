const Thumbnail = require('../models/Thumbnail');

// @desc    Create new thumbnail
// @route   POST /api/thumbnails/create
// @access  Public
const createThumbnail = async (req, res) => {
  const { videoId, thumbnailUrl } = req.body;

  if (!videoId || !thumbnailUrl) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // ✅ Check if videoId already exists
  const existingThumbnail = await Thumbnail.findOne({ videoId });
  if (existingThumbnail) {
    return res.status(400).json({ message: 'Thumbnail with this videoId already exists' });
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 3);

  try {
    const thumbnail = await Thumbnail.create({ videoId, thumbnailUrl, expiresAt });
    res.status(201).json(thumbnail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all thumbnails
// @route   GET /api/thumbnails
// @access  Public
const getThumbnails = async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find();
    res.status(200).json(thumbnails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a thumbnail
// @route   DELETE /api/thumbnails/:id
// @access  Public
const deleteThumbnail = async (req, res) => {
  const { id } = req.params;

  try {
    const thumbnail = await Thumbnail.findById(id);
    if (!thumbnail) {
      return res.status(404).json({ message: 'Thumbnail not found' });
    }

    await thumbnail.deleteOne();
    res.status(200).json({ message: 'Thumbnail deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createThumbnail,
  getThumbnails,
  deleteThumbnail
};
