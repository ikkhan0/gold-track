# Quick Start API Testing Guide

## 🚀 Getting Started

### 1. Start the Server
```bash
cd server
npm install
npm run dev
```

Server will be running at `http://localhost:5000`

### 2. Test Base Endpoint
```bash
curl http://localhost:5000
# Response: "API is Running..."
```

---

## 🧪 Test Scenarios

### Scenario 1: User Registration & Login

**Step 1: Register as Shipper**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Ahmed Transport Co",
  "email": "ahmed@shipperco.com",
  "password": "password123",
  "phone": "03001234567",
  "role": "shipper",
  "companyName": "Ahmed Transport",
  "city": "Karachi",
  "ntn": "1234567"
}
```

**Step 2: Admin Approval** (Use admin panel or direct DB update)
```bash
PUT http://localhost:5000/api/admin/users/:userId/approve
Authorization: Bearer ADMIN_TOKEN
```

**Step 3: Login**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "ahmed@shipperco.com",
  "password": "password123"
}
```
Save the `token` from response!

---

### Scenario 2: Post a Load & Receive Bids

**Step 1: Shipper Posts Load**
```bash
POST http://localhost:5000/api/loads
Authorization: Bearer SHIPPER_TOKEN
Content-Type: application/json

{
  "origin": "Karachi",
  "destination": "Lahore",
  "goodsType": "Electronics",
  "weight": 5,
  "requiredVehicle": "10-Wheeler",
  "offerPrice": 85000,
  "pickupDate": "2025-01-05"
}
```

**Step 2: Carrier Places Bid**
```bash
POST http://localhost:5000/api/loads/:loadId/bid
Authorization: Bearer CARRIER_TOKEN
Content-Type: application/json

{
  "amount": 80000,
  "note": "I have 10-Wheeler available in Karachi. Can pickup tomorrow."
}
```

**Step 3: Check Notifications (Shipper)**
```bash
GET http://localhost:5000/api/notifications
Authorization: Bearer SHIPPER_TOKEN
```

**Step 4: Accept Bid**
```bash
PUT http://localhost:5000/api/loads/:loadId/bids/:bidId
Authorization: Bearer SHIPPER_TOKEN
Content-Type: application/json

{
  "status": "Accepted"
}
```

---

### Scenario 3: Track Load & Deliver

**Step 1: Add Tracking Update**
```bash
POST http://localhost:5000/api/tracking/:loadId/update
Authorization: Bearer CARRIER_TOKEN
Content-Type: application/json

{
  "status": "In-Transit",
  "location": "Multan",
  "note": "Halfway to destination"
}
```

**Step 2: Update GPS Location**
```bash
POST http://localhost:5000/api/tracking/:loadId/location
Authorization: Bearer CARRIER_TOKEN
Content-Type: application/json

{
  "lat": 30.1575,
  "lng": 71.5249,
  "address": "Multan, Punjab"
}
```

**Step 3: Upload Proof of Delivery**
```bash
POST http://localhost:5000/api/tracking/:loadId/pod
Authorization: Bearer CARRIER_TOKEN
Content-Type: multipart/form-data

{
  "images": [FILES],
  "signature": "Customer Name"
}
```

**Step 4: Complete Delivery**
```bash
PUT http://localhost:5000/api/tracking/:loadId/complete
Authorization: Bearer CARRIER_TOKEN
```

---

### Scenario 4: Submit Reviews

**Shipper Reviews Carrier**
```bash
POST http://localhost:5000/api/reviews
Authorization: Bearer SHIPPER_TOKEN
Content-Type: application/json

{
  "loadId": "LOAD_ID",
  "revieweeId": "CARRIER_ID",
  "rating": 5,
  "comment": "Excellent service! On-time delivery.",
  "punctuality": 5,
  "communication": 5,
  "professionalism": 5
}
```

---

### Scenario 5: Document Upload & Verification

**Upload Document**
```bash
POST http://localhost:5000/api/documents/upload
Authorization: Bearer USER_TOKEN
Content-Type: multipart/form-data

{
  "file": [PDF/IMAGE FILE],
  "type": "cnic",
  "ownerModel": "User",
  "expiryDate": "2027-12-31"
}
```

**Admin Verifies**
```bash
PUT http://localhost:5000/api/documents/:documentId/verify
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "verified"
}
```

---

### Scenario 6: Messaging

**Send Message**
```bash
POST http://localhost:5000/api/messages
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "receiverId": "OTHER_USER_ID",
  "message": "Hi, I'm interested in this load.",
  "loadId": "LOAD_ID"
}
```

**Get Conversations**
```bash
GET http://localhost:5000/api/messages/conversations
Authorization: Bearer USER_TOKEN
```

---

### Scenario 7: Dashboard & Analytics

**Get Dashboard Stats**
```bash
GET http://localhost:5000/api/dashboard/stats
Authorization: Bearer USER_TOKEN
```

**Market Insights**
```bash
GET http://localhost:5000/api/analytics/market-insights
Authorization: Bearer USER_TOKEN
```

**My Performance**
```bash
GET http://localhost:5000/api/analytics/my-performance
Authorization: Bearer USER_TOKEN
```

---

## 📊 Expected Workflow

```
1. Registration → 2. Admin Approval → 3. Login
         ↓
4. Post Load / Add Vehicle
         ↓
5. Place Bids ← → Notifications
         ↓
6. Accept Bid → Auto-assign Load
         ↓
7. Track Load → GPS Updates
         ↓
8. Upload POD → Mark Delivered
         ↓
9. Submit Reviews ← → Rating Updates
```

---

## 🔍 Quick Checks

### Check All Loads
```bash
GET http://localhost:5000/api/loads
```

### Check My Notifications
```bash
GET http://localhost:5000/api/notifications?unreadOnly=true
```

### Check User Reviews
```bash
GET http://localhost:5000/api/reviews/user/:userId
```

### Admin: Pending Documents
```bash
GET http://localhost:5000/api/documents/pending
Authorization: Bearer ADMIN_TOKEN
```

---

## 🛠️ Useful Tips

1. **Save Tokens**: Keep user tokens in environment variables
2. **Use Postman**: Import as collection for easier testing
3. **Check Logs**: Watch server console for detailed error messages
4. **Database**: Use MongoDB Compass to view data directly

---

## 🎯 Success Indicators

- ✅ Users can register and login
- ✅ Notifications appear for bid events
- ✅ Dashboard shows correct statistics
- ✅ Files upload to Cloudinary
- ✅ Emails sent for notifications
- ✅ Reviews update user ratings
- ✅ Tracking updates persist
- ✅ Analytics show market data

Happy Testing! 🚀
