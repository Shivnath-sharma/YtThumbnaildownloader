const express = require('express');
const router = express.Router();
const {
  createThumbnail,
  getThumbnails,
  deleteThumbnail
} = require('../controllers/thumbnailController');

router.post('/create', createThumbnail);
router.get('/', getThumbnails);
router.delete('/:id', deleteThumbnail);

module.exports = router;
