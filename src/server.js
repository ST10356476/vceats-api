require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');
const notificationRoutes = require('./routes/notification.routes');
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Small logger that only prints in non-production environments
const isProd = process.env.NODE_ENV === 'production';
const log = {
    info: (...args) => { if (!isProd) console.log(...args); },
    error: (...args) => { if (!isProd) console.error(...args); }
};

// Database connection helper
const connectDB = async (uri) => {
    const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/vceats';
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        log.info('✅ MongoDB connected successfully');
    } catch (err) {
        log.error('❌ MongoDB connection error:');
        // Only print error stack when not in production
        if (!isProd) log.error(err);
        throw err;
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
// Dashboard static page and API
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/api/dashboard', dashboardRoutes);

// Respond to Chrome DevTools app-specific probe to avoid noisy 404s
// Accept any method and any path under /.well-known/appspecific to silence probes
// Use a named param with a wildcard to avoid path-to-regexp errors
// Use a regular expression route to match any path under /.well-known/appspecific/
app.all(/^\/\.well-known\/appspecific\/.*$/, (req, res) => {
    // Return 204 No Content for probe requests
    return res.status(204).end();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'VCEats API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    // Avoid leaking stack traces in production
    if (!isProd) console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            status: 404
        }
    });
});

// Start server only if this file is run directly
if (require.main === module) {
    // connect to DB then start server
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                if (!isProd) {
                    console.log(`🚀 VCEats API server running on port ${PORT}`);
                    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
                }
            });
        })
        .catch(err => {
            log.error('Failed to start server due to DB error:');
            if (!isProd) log.error(err);
            process.exit(1);
        });
}

module.exports = { app, connectDB };