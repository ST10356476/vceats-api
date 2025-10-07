const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', menuController.getAllMenuItems);
router.get('/categories', menuController.getCategories);
router.get('/:id', menuController.getMenuItemById);
router.post('/', protect, authorize('STAFF', 'ADMIN'), menuController.createMenuItem);
router.put('/:id', protect, authorize('STAFF', 'ADMIN'), menuController.updateMenuItem);
router.delete('/:id', protect, authorize('STAFF', 'ADMIN'), menuController.deleteMenuItem);

module.exports = router;