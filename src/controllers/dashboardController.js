const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');

// GET /api/dashboard/stats
exports.getStats = async (req, res) => {
    try {
        // Total orders and counts by status
        const totalOrders = await Order.countDocuments();
        const pending = await Order.countDocuments({ status: 'PENDING' });
        const preparing = await Order.countDocuments({ status: 'PREPARING' });
        const ready = await Order.countDocuments({ status: 'READY' });
        const completed = await Order.countDocuments({ status: 'COMPLETED' });
        const cancelled = await Order.countDocuments({ status: 'CANCELLED' });

        // Total sales for completed orders
        const salesAgg = await Order.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $group: { _id: null, totalSales: { $sum: '$total' } } }
        ]);
        const totalSales = (salesAgg[0] && salesAgg[0].totalSales) || 0;

        // Orders per day for the last 7 days
        const today = new Date();
        const pastDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000); // 7 days inclusive
        const ordersPerDayAgg = await Order.aggregate([
            { $match: { createdAt: { $gte: pastDate } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // Top menu items by quantity (last 30 days)
        const past30 = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
        const topItemsAgg = await Order.aggregate([
            { $match: { createdAt: { $gte: past30 } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.menuItem', quantity: { $sum: '$items.quantity' } } },
            { $sort: { quantity: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'menuitems', localField: '_id', foreignField: '_id', as: 'menuItem' } },
            { $unwind: { path: '$menuItem', preserveNullAndEmptyArrays: true } },
            { $project: { _id: 0, menuItemId: '$_id', name: '$menuItem.name', quantity: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalOrders,
                byStatus: { pending, preparing, ready, completed, cancelled },
                totalSales,
                ordersPerDay: ordersPerDayAgg,
                topMenuItems: topItemsAgg
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
    }
};
