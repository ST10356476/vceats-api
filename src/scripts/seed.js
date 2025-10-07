require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        if (process.env.NODE_ENV !== 'production') console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await MenuItem.deleteMany({});
    if (process.env.NODE_ENV !== 'production') console.log('🗑️  Cleared existing data');

        // Create users
        const users = await User.create([
            {
                name: 'John Doe',
                email: 'student@varsity.ac.za',
                password: 'password',
                studentId: 'ST123456',
                role: 'STUDENT'
            },
            {
                name: 'Jane Smith',
                email: 'staff@varsity.ac.za',
                password: 'password',
                role: 'STAFF',
                department: 'Food Services'
            },
            {
                name: 'Admin User',
                email: 'admin@varsity.ac.za',
                password: 'password',
                role: 'ADMIN',
                department: 'Management'
            }
        ]);
    if (process.env.NODE_ENV !== 'production') console.log('✅ Created users');

        // Create menu items
        const menuItems = await MenuItem.create([
            // Breakfast
            {
                name: 'Full English Breakfast',
                description: 'Eggs, bacon, sausage, beans, toast, grilled tomato',
                price: 45.0,
                image: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d',
                category: 'breakfast',
                available: true,
                nutrition: { calories: 650, protein: 28, carbs: 45, fat: 38, fiber: 6, sodium: 1200 },
                allergens: ['Gluten', 'Eggs'],
                isSpecial: true
            },
            {
                name: 'Pancakes & Syrup',
                description: 'Stack of fluffy pancakes with maple syrup and butter',
                price: 32.0,
                image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
                category: 'breakfast',
                available: true,
                nutrition: { calories: 420, protein: 8, carbs: 68, fat: 12, fiber: 3, sodium: 380 },
                allergens: ['Gluten', 'Dairy', 'Eggs']
            },
            {
                name: 'Breakfast Wrap',
                description: 'Scrambled eggs, cheese, and bacon in a wheat tortilla',
                price: 28.0,
                image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50',
                category: 'breakfast',
                available: true,
                nutrition: { calories: 380, protein: 22, carbs: 35, fat: 18, fiber: 4, sodium: 850 },
                allergens: ['Gluten', 'Dairy', 'Eggs']
            },
            // Lunch
            {
                name: 'Chicken Schnitzel',
                description: 'Crispy breaded chicken breast with chips and salad',
                price: 65.0,
                image: 'https://images.unsplash.com/photo-1562967914-608f82629710',
                category: 'lunch',
                available: true,
                nutrition: { calories: 720, protein: 45, carbs: 58, fat: 32, fiber: 8, sodium: 980 },
                allergens: ['Gluten', 'Eggs']
            },
            {
                name: 'Beef Burger & Chips',
                description: 'Juicy beef patty with lettuce, tomato, cheese, and chips',
                price: 55.0,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
                category: 'lunch',
                available: true,
                nutrition: { calories: 820, protein: 38, carbs: 62, fat: 42, fiber: 5, sodium: 1150 },
                allergens: ['Gluten', 'Dairy']
            },
            {
                name: 'Caesar Salad',
                description: 'Crisp lettuce, croutons, parmesan, and caesar dressing',
                price: 42.0,
                image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
                category: 'lunch',
                available: false,
                nutrition: { calories: 290, protein: 12, carbs: 18, fat: 20, fiber: 6, sodium: 650 },
                allergens: ['Gluten', 'Dairy', 'Anchovies']
            },
            // Beverages
            {
                name: 'Cappuccino',
                description: 'Rich espresso with steamed milk foam',
                price: 18.0,
                image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
                category: 'beverages',
                available: true,
                nutrition: { calories: 120, protein: 6, carbs: 12, fat: 6, fiber: 0, sodium: 95 },
                allergens: ['Dairy']
            },
            {
                name: 'Fresh Orange Juice',
                description: 'Freshly squeezed orange juice',
                price: 15.0,
                image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
                category: 'beverages',
                available: true,
                nutrition: { calories: 110, protein: 2, carbs: 26, fat: 0, fiber: 1, sodium: 2 },
                allergens: []
            },
            {
                name: 'Iced Tea',
                description: 'Refreshing iced tea with lemon',
                price: 12.0,
                image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
                category: 'beverages',
                available: true,
                nutrition: { calories: 70, protein: 0, carbs: 18, fat: 0, fiber: 0, sodium: 10 },
                allergens: []
            },
            // Snacks
            {
                name: 'Chicken Wings',
                description: '6 pieces with buffalo or BBQ sauce',
                price: 35.0,
                image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2',
                category: 'snacks',
                available: true,
                nutrition: { calories: 480, protein: 32, carbs: 8, fat: 35, fiber: 1, sodium: 890 },
                allergens: []
            },
            {
                name: 'Nachos',
                description: 'Tortilla chips with cheese, salsa, and guacamole',
                price: 28.0,
                image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d',
                category: 'snacks',
                available: true,
                nutrition: { calories: 520, protein: 14, carbs: 45, fat: 32, fiber: 8, sodium: 750 },
                allergens: ['Dairy']
            }
        ]);
        if (process.env.NODE_ENV !== 'production') {
            console.log('✅ Created menu items');
            console.log('\n✨ Database seeded successfully!');
        }

        process.exit(0);
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();