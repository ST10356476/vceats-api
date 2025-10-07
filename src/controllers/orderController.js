const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.createOrder = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;
        
        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }
        
        // Calculate total
        let total = 0;
        const orderItems = [];
        
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return res.status(404).json({
                    success: false,
                    message: `Menu item ${item.menuItem} not found`
                });
            }
            
            orderItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                quantity: item.quantity,
                price: menuItem.price,
                image: menuItem.image
            });
            
            total += menuItem.price * item.quantity;
        }
        
        // Add 5% tax
        total = total * 1.05;
        
        // Get current time
        const now = new Date();
        const orderTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        // Calculate estimated time (20 minutes from now)
        const estimatedDate = new Date(now.getTime() + 20 * 60000);
        const estimatedTime = estimatedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        // Generate order number
        const count = await Order.countDocuments();
        const orderNumber = `VC${String(count + 1).padStart(3, '0')}`;

        // Create order
        const order = await Order.create({
            orderNumber,
            user: req.user.id,
            items: orderItems,
            total,
            orderTime,
            estimatedTime,
            paymentMethod: paymentMethod || 'CASH'
        });
        
        // Populate menu items
        await order.populate('items.menuItem');
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: { order }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('items.menuItem');
        
        res.status(200).json({
            success: true,
            count: orders.length,
            data: { orders }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = {};
        if (status) query.status = status.toUpperCase();
        
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'name email studentId')
            .populate('items.menuItem');
        
        res.status(200).json({
            success: true,
            count: orders.length,
            data: { orders }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: status.toUpperCase() },
            { new: true, runValidators: true }
        ).populate('items.menuItem');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: { order }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};
