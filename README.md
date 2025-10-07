# VCEats API

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Installation

1. Clone and setup:
```bash
mkdir vceats-api && cd vceats-api
npm init -y
```

2. Install dependencies:
```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cors express-validator morgan
npm install --save-dev nodemon
```

3. Create .env file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vceats
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

4. Run seed data:
```bash
node src/scripts/seed.js
```

5. Start server:
```bash
npm run dev
```

## 📡 API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user (Protected)

### Menu
- GET /api/menu - Get all menu items
- GET /api/menu/categories - Get categories
- GET /api/menu/:id - Get single item
- POST /api/menu - Create item (Staff/Admin only)
- PUT /api/menu/:id - Update item (Staff/Admin only)
- DELETE /api/menu/:id - Delete item (Staff/Admin only)

### Orders
- POST /api/orders - Create order (Protected)
- GET /api/orders/my-orders - Get user orders (Protected)
- GET /api/orders - Get all orders (Staff/Admin only)
- PATCH /api/orders/:id/status - Update order status (Staff/Admin only)

## 🧪 Testing with Postman

### 1. Register/Login
POST http://localhost:3000/api/auth/login
Body: { "email": "student@varsity.ac.za", "password": "password" }

Copy the token from response.

### 2. Protected Routes
Add to Headers:
Authorization: Bearer YOUR_TOKEN_HERE

### 3. Create Order
POST http://localhost:3000/api/orders
Headers: Authorization: Bearer YOUR_TOKEN
Body:
{
  "items": [
    { "menuItem": "MENU_ITEM_ID", "quantity": 2 }
  ],
  "paymentMethod": "CARD"
}

## 🔗 Android Integration

In your Android app, update the base URL in Retrofit:
```kotlin
private const val BASE_URL = "http://YOUR_IP:3000/api/"
```