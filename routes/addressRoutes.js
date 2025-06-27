const express = require('express');
const router = express.Router();
const { getAddress, updateAddress } = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAddress).post(protect, updateAddress);

module.exports = router;
