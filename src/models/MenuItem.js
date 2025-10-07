const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 }
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: [true, 'Image URL is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['breakfast', 'lunch', 'beverages', 'snacks'],
        lowercase: true
    },
    available: {
        type: Boolean,
        default: true
    },
    nutrition: {
        type: nutritionSchema,
        required: true
    },
    allergens: [{
        type: String,
        trim: true
    }],
    isSpecial: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
menuItemSchema.index({ category: 1, available: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);