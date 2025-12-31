# LoadBoard Backend API

A comprehensive freight load management system inspired by DAT LoadBoard, built with Node.js, Express, and MongoDB.

## 🚀 Features

### Core Functionality
- ✅ **User Management** - Multi-role system (Super Admin, Admin, Shipper, Broker, Carrier, Fleet Owner, Owner Operator)
- ✅ **Load Management** - Post, search, bid on loads with advanced filtering
- ✅ **Bidding System** - Real-time bidding with acceptance/rejection workflow
- ✅ **Notifications** - In-app notifications and email alerts for all events
- ✅ **Reviews & Ratings** - Trust-building system after delivery completion
- ✅ **Document Management** - Upload and verify licenses, insurance, POD with Cloudinary
- ✅ **In-App Messaging** - Direct messaging between shippers and carriers
- ✅ **Load Tracking** - Real-time tracking updates and location sharing
- ✅ **Analytics Dashboard** - DAT-like market insights and performance metrics

### DAT-Inspired Features
- 📊 Market conditions and load-to-truck ratios
- 🔥 Hot routes analysis
- 📈 Average rate tracking by vehicle type
- 🚛 Vehicle demand insights
- ⭐ Top-rated carriers leaderboard
- 📍 Real-time GPS tracking
- 💰 Earnings and spending analytics

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)
- Gmail account (for email notifications)

### Setup

1. **Install dependencies**
```bash
cd server
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Seed database (optional)**
```bash
node seed.js
# OR create admin users
node seedAdminUsers.js
```

4. **Start server**
```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login

### Loads (`/api/loads`)
- `GET /` - Get all loads (with filters)
- `POST /` - Create load (Shipper only)
- `GET /posted` - Get my posted loads
- `GET /bidded` - Get loads I've bid on
- `POST /:id/bid` - Place bid on load
- `PUT /:id/bids/:bidId` - Accept/reject bid

### Vehicles (`/api/vehicles`)
- `GET /` - Get my vehicles
- `POST /` - Add vehicle
- `DELETE /:id` - Delete vehicle

### Dashboard (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics with market insights

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark as read
- `PUT /read-all` - Mark all as read
- `DELETE /:id` - Delete notification

### Reviews (`/api/reviews`)
- `POST /` - Submit review
- `GET /user/:id` - Get user reviews
- `GET /load/:id` - Get load reviews
- `PUT /:id` - Update review (24h limit)

### Documents (`/api/documents`)
- `POST /upload` - Upload document
- `GET /user/:id` - Get user documents
- `GET /vehicle/:id` - Get vehicle documents
- `PUT /:id/verify` - Verify document (Admin)
- `DELETE /:id` - Delete document

### Messages (`/api/messages`)
- `POST /` - Send message
- `GET /conversation/:userId` - Get conversation
- `GET /conversations` - Get all conversations
- `PUT /:id/read` - Mark as read

### Tracking (`/api/tracking`)
- `POST /:loadId/update` - Add tracking update
- `POST /:loadId/location` - Update GPS location
- `POST /:loadId/pod` - Upload proof of delivery
- `PUT /:loadId/complete` - Mark as delivered
- `GET /:loadId` - Get tracking history

### Analytics (`/api/analytics`)
- `GET /overview` - Platform overview (Admin)
- `GET /load-trends` - Load posting trends
- `GET /popular-routes` - Popular routes
- `GET /market-insights` - Market conditions & insights
- `GET /user-activity` - User activity metrics (Admin)
- `GET /my-performance` - User performance metrics

### Admin (`/api/admin`)
- `GET /users` - List all users
- `PUT /users/:id/approve` - Approve user
- `PUT /users/:id/suspend` - Suspend user
- `GET /stats` - Admin statistics
- `GET /cms` - Get CMS content
- `PUT /cms/:key` - Update CMS content

## 🔐 Authentication

All protected routes require JWT token in headers:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

## 🎯 User Roles & Permissions

| Feature | Super Admin | Admin | Shipper/Broker | Carrier/Fleet Owner |
|---------|------------|-------|----------------|---------------------|
| Post Loads | ✅ | ✅ | ✅ | ❌ |
| Bid on Loads | ❌ | ❌ | ❌ | ✅ |
| Manage Users | ✅ | ✅ | ❌ | ❌ |
| Verify Documents | ✅ | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | Own Only | Own Only |
| Manage Vehicles | ❌ | ❌ | ❌ | ✅ |

## 📧 Notifications

Automatic notifications are sent for:
- New bid received
- Bid accepted/rejected
- Load assigned
- Delivery completed
- New message
- Document verified/rejected
- Review received

## 🗄️ Database Schema

### Models
- **User** - User profiles with role-based fields
- **Load** - Load postings with tracking and bidding
- **Vehicle** - Vehicle fleet management
- **Notification** - User notifications
- **Review** - Reviews and ratings
- **Document** - Document uploads with verification
- **Message** - In-app messaging
- **CMSContent** - Website content management

## 🔧 Environment Variables

See `.env.example` for required configuration:
- MongoDB connection
- JWT secret
- Cloudinary credentials
- Email (SMTP) settings
- Optional: Twilio for SMS

## 📊 Rate Limiting

- 100 requests per 15 minutes per IP
- Prevents API abuse
- Configurable in `server.js`

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation (express-validator)
- Rate limiting
- Mongoose sanitization
- Error handling middleware

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Set these in your hosting platform:
- All variables from `.env.example`
- Set `NODE_ENV=production`

## 🧪 Testing

### Manual Testing
1. Register users with different roles
2. Create loads and place bids
3. Test notification system
4. Upload documents
5. Send messages
6. Track loads
7. Generate analytics

### Postman Collection
Import `loadboard.postman_collection.json` (if available)

## 📈 Performance Optimization

- Database indexes on frequently queried fields
- Pagination for large datasets
- Mongoose populate for efficient joins
- Response caching (future enhancement)

## 🔄 Future Enhancements

- [ ] Socket.io for real-time updates
- [ ] Payment gateway integration
- [ ] Advanced search with Elasticsearch
- [ ] Mobile push notifications
- [ ] Automated load matching
- [ ] Route optimization algorithms
- [ ] Multi-language support

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🤝 Support

For issues or questions, please create an issue in the repository.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ for the logistics industry
