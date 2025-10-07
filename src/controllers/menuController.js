const MenuItem = require('../models/MenuItem');

exports.getAllMenuItems = async (req, res) => {
    try {
        const { category, available } = req.query;
        
        let query = {};
        if (category) query.category = category;
        if (available !== undefined) query.available = available === 'true';
        
        const menuItems = await MenuItem.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: { menuItems }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch menu items',
            error: error.message
        });
    }
};

exports.getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: { menuItem }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch menu item',
            error: error.message
        });
    }
};

exports.createMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: { menuItem }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create menu item',
            error: error.message
        });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Menu item updated successfully',
            data: { menuItem }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update menu item',
            error: error.message
        });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete menu item',
            error: error.message
        });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = [
            { id: 'breakfast', title: 'Breakfast', icon: '🥞' },
            { id: 'lunch', title: 'Lunch', icon: '🍽️' },
            { id: 'beverages', title: 'Beverages', icon: '☕' },
            { id: 'snacks', title: 'Snacks', icon: '🍿' }
        ];
        
        res.status(200).json({
            success: true,
            data: { categories }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};
