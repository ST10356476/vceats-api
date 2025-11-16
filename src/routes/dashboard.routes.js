const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth.middleware');

// Staff/Admin only dashboard stats
router.get('/stats', protect, authorize('STAFF', 'ADMIN'), dashboardController.getStats);

module.exports = router;
