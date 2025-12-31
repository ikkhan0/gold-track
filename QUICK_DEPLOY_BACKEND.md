# Backend Deployment Quick Setup

## 🚀 Deploy Backend on Render (5 Minutes)

### Step 1: Create Render Account
1. Go to: https://dashboard.render.com/register
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub repository: `ikkhan0/gold-track`

### Step 3: Configure Service
```
Name: goldtrack-api
Region: Singapore (closest to Pakistan)
Branch: main
Root Directory: server
Build Command: npm install
Start Command: node server.js
```

### Step 4: Add Environment Variables
Click "Add Environment Variable" for each:

```env
MONGO_URI = mongodb+srv://your-connection-string
JWT_SECRET = your_secret_key_here
PORT = 5000
NODE_ENV = production
```

### Step 5: Create Service
Click "Create Web Service" - wait 2-3 minutes for deployment

### Step 6: Get Your API URL
After deployment completes, you'll see: `https://goldtrack-api.onrender.com`

### Step 7: Update Vercel
1. Go to: https://vercel.com/dashboard
2. Select project: `gold-track`
3. Settings → Environment Variables
4. Add variable:
   - Name: `VITE_API_URL`
   - Value: `https://goldtrack-api.onrender.com/api`
5. Deployments → Redeploy

### Step 8: Update CORS in Backend
In `server/server.js`, update CORS:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://gold-track-flax.vercel.app',
    'https://gold-track-*.vercel.app'
  ],
  credentials: true
};
```

Commit and push to trigger redeployment on Render.

## ✅ Verification
Visit: https://gold-track-flax.vercel.app/admin/login
Login with: admin@goldtrack.pk / admin123

---

**Your URLs:**
- Frontend: https://gold-track-flax.vercel.app
- Backend: https://goldtrack-api.onrender.com (after deployment)
- Database: MongoDB Atlas (already configured)

**Total Cost:** $0 (Free tier)
