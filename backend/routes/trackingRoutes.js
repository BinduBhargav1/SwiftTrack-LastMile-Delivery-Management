const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

router.get('/:id', trackingController.getTrackingHistory);

module.exports = router;
