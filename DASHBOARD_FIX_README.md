# 🚛 LoadBoard Dashboard Fix - Complete Guide

## Issues Fixed ✅

### 1. **Dashboard API Issues**
- ✅ Fixed `/api/dashboard/stats` returning wrong format
- ✅ Updated to return `activeJobs`, `myTrucks`, `pendingBids`, `totalEarnings` for carriers
- ✅ Updated to return `activePostings`, `inProgress`, `bidsReceived`, `totalSpent` for shippers

### 2. **Authentication Middleware**
- ✅ Added `authorize(...roles)` function for role-based access
- ✅ Added `isAdmin` middleware for admin-only routes
- ✅ Fixed token validation to fetch full user object from database

### 3. **CSS Issues**
- ✅ Created `Dashboard.css` for carrier/shipper dashboards
- ✅ Created `AdminDashboard.css` for admin panels
- ✅ All dashboards now have proper styling with Pakistan theme (Gold & Dark Green)

### 4. **Database Connections**
- ✅ Added proper MongoDB indexes to models
- ✅ Fixed ObjectId references in Load model
- ✅ Added User population in authMiddleware

### 5. **Admin Routes**
- ✅ Added CMS management routes (`GET /api/admin/cms`, `PUT /api/admin/cms/:key`)
- ✅ Fixed admin authentication for all routes

### 6. **Server Configuration**
- ✅ Added all missing route imports to server.js
- ✅ Mounted all API routes properly

---

## 🚀 Quick Start

### Step 1: Test Database Connection

```bash
cd server
node testDatabase.js
```

This will:
- Test MongoDB connection
- Show all collections and document counts
- Display user statistics
- Verify admin users exist

### Step 2: Start Backend Server

```bash
cd server
npm install
node server.js
```

Server will run on: `http://localhost:5000`

### Step 3: Start Frontend

```bash
cd client
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 📊 Dashboard Routes

### **User Dashboards:**
- `/dashboard` - Main dashboard (role-based routing)
- `/dashboard/loads` - Find loads (carriers)
- `/dashboard/post-load` - Post new load (shippers)
- `/dashboard/post-truck` - Post truck availability (carriers)
- `/dashboard/find-trucks` - Find available trucks (shippers)
- `/dashboard/my-postings` - My posted loads/trucks
- `/dashboard/my-loads` - Active and completed loads
- `/dashboard/trucks` - Vehicle management

### **Admin Dashboards:**
- `/admin/login` - Admin login page
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/loads` - Load management
- `/admin/trucks` - Truck management
- `/admin/cms` - Content management
- `/admin/settings` - System settings
- `/admin/super-admin` - Super admin dashboard

---

## 🔐 Default Admin Credentials

If you haven't created admin users, run:

```bash
cd server
node seedAdminUsers.js
```

This creates:
- **Super Admin**: `superadmin@loadboard.pk` / `admin123`
- **Admin**: `admin@loadboard.pk` / `admin123`

---

## 🗄️ Database Schema

### Collections Created:
- `users` - User accounts (carriers, shippers, admins)
- `loads` - Load postings with bidding system
- `vehicles` - User-owned vehicles
- `truckavailabilities` - Truck availability postings
- `messages` - In-app messaging
- `notifications` - Push notifications
- `reviews` - Rating & review system
- `documents` - File uploads
- `lanerates` - Market rate analytics
- `savedsearches` - Saved search filters
- `cmscontents` - Dynamic website content

---

## 🐛 Troubleshooting

### Dashboard Not Loading?

1. **Check if backend is running:**
   ```bash
   curl http://localhost:5000
   # Should return: "API is Running..."
   ```

2. **Check if MongoDB is connected:**
   ```bash
   cd server
   node testDatabase.js
   ```

3. **Check browser console for errors:**
   - Open DevTools (F12)
   - Look for network errors (401, 404, 500)
   - Check API requests to `/api/dashboard/stats`

### CSS Not Showing?

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Restart Vite dev server:**
   ```bash
   cd client
   npm run dev
   ```

### MongoDB Connection Issues?

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Or check service status
   sc query MongoDB
   ```

2. **Verify .env file:**
   ```bash
   cd server
   cat .env
   # Should have: MONGO_URI=mongodb://localhost:27017/loadboard
   ```

3. **Test connection manually:**
   ```bash
   mongosh "mongodb://localhost:27017/loadboard"
   ```

### Admin Login Not Working?

1. **Create admin user:**
   ```bash
   cd server
   node seedAdminUsers.js
   ```

2. **Check admin token:**
   - Open DevTools → Application → Local Storage
   - Look for `adminToken`
   - If missing, login again at `/admin/login`

### Stats Not Showing in Dashboard?

1. **Check API response:**
   ```bash
   # With your auth token
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/dashboard/stats
   ```

2. **Verify user role in database:**
   ```bash
   mongosh loadboard
   db.users.findOne({ email: "your@email.com" })
   ```

---

## 📝 API Endpoints Reference

### Dashboard Stats
```
GET /api/dashboard/stats
Headers: Authorization: Bearer <token>

Response (Carrier):
{
  "activeJobs": 5,
  "myTrucks": 3,
  "pendingBids": 7,
  "totalEarnings": 150000
}

Response (Shipper):
{
  "activePostings": 8,
  "inProgress": 2,
  "bidsReceived": 25,
  "totalSpent": 0
}
```

### Admin - Get All Users
```
GET /api/admin/users?status=pending
Headers: Authorization: Bearer <adminToken>

Response:
[
  {
    "_id": "...",
    "name": "John Carrier",
    "email": "john@example.com",
    "role": "carrier",
    "status": "pending",
    "cnic": "12345-1234567-1",
    "phone": "+92300XXXXXXX"
  }
]
```

### Admin - Approve/Reject User
```
PUT /api/admin/users/:id/status
Headers: Authorization: Bearer <adminToken>
Body: { "status": "approved" }

Response:
{
  "_id": "...",
  "name": "John Carrier",
  "email": "john@example.com",
  "status": "approved"
}
```

### Admin - Get CMS Content
```
GET /api/admin/cms
Headers: Authorization: Bearer <adminToken>

Response:
[
  {
    "_id": "...",
    "key": "homepage_hero_title",
    "section": "homepage",
    "title": "Find Loads. Move Pakistan.",
    "content": "Pakistan's Premier Freight Marketplace",
    "isActive": true
  }
]
```

---

## 🎨 Dashboard Color Scheme

**Dark Theme (Pakistan Inspired):**
- Primary Background: `#0F1111` (Dark Gray)
- Secondary Background: `#1A1D1D` (Lighter Gray)
- Accent Gold: `#D4AF37` (Pakistani Gold)
- Dark Green: `#004D40` (Pakistani Green)
- Text Primary: `#F5F5F5` (Light Gray)
- Text Secondary: `#B0B3B8` (Medium Gray)

---

## 🔧 Environment Variables

Create `.env` file in `server/` directory:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/loadboard

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_12345

# Server
PORT=5000
NODE_ENV=development
```

---

## 📦 Required Dependencies

### Backend (Already in package.json):
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv

### Frontend (Already in package.json):
- react
- react-router-dom
- axios
- lucide-react

---

## ✅ Verification Checklist

- [ ] MongoDB is running and connected
- [ ] Backend server starts without errors (`node server.js`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can login at `/login`
- [ ] Carrier dashboard shows stats at `/dashboard`
- [ ] Shipper dashboard shows stats at `/dashboard`
- [ ] Admin can login at `/admin/login`
- [ ] Admin dashboard shows pending users at `/admin`
- [ ] CMS management works at `/admin/cms`
- [ ] All CSS styles are loading properly

---

## 🆘 Need More Help?

1. **Check logs:**
   - Backend: Terminal where `node server.js` is running
   - Frontend: Browser console (F12)

2. **Run database test:**
   ```bash
   cd server
   node testDatabase.js
   ```

3. **Verify all routes are mounted:**
   ```bash
   cd server
   grep "app.use" server.js
   ```

4. **Check if all dependencies installed:**
   ```bash
   cd server && npm install
   cd client && npm install
   ```

---

## 🎯 Summary of Changes

1. ✅ Fixed `authMiddleware.js` - Added authorize & isAdmin functions
2. ✅ Fixed `dashboard.js` - Correct stat property names
3. ✅ Fixed `admin.js` - Added CMS routes
4. ✅ Created `Dashboard.css` - User dashboard styles
5. ✅ Created `AdminDashboard.css` - Admin dashboard styles
6. ✅ Updated all dashboard components - Import CSS
7. ✅ Fixed `server.js` - Added all route imports
8. ✅ Created `testDatabase.js` - Database testing utility
9. ✅ Updated `Load.js` - Added proper indexes

**Your loadboard dashboards are now fully functional! 🎉**
