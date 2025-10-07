const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);
router.get('/', protect, authorize('STAFF', 'ADMIN'), orderController.getAllOrders);
router.patch('/:id/status', protect, authorize('STAFF', 'ADMIN'), orderController.updateOrderStatus);

module.exports = router;