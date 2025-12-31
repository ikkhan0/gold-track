# 🚀 Vercel Deployment Guide

## ⚠️ IMPORTANT: Backend Setup Required

Your frontend is deployed on Vercel, but you need to deploy the backend separately since Vercel is designed for frontend applications.

## 📋 Deployment Steps

### Option 1: Deploy Backend on Render (Recommended - Free)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `goldtrack-backend`
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start` or `node server.js`
     - **Environment Variables**:
       ```
       MONGO_URI=your_mongodb_connection_string
       JWT_SECRET=your_jwt_secret
       PORT=5000
       ```

3. **Get Backend URL**
   - After deployment, you'll get a URL like: `https://goldtrack-backend.onrender.com`

### Option 2: Deploy Backend on Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub repo
4. Select `server` folder
5. Add environment variables
6. Get your backend URL

### Option 3: Deploy Backend on Heroku

1. Install Heroku CLI
2. From the `server` directory:
   ```bash
   heroku create goldtrack-backend
   heroku config:set MONGO_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   git subtree push --prefix server heroku main
   ```

## 🔧 Configure Vercel Frontend

After deploying the backend:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select Your Project** (gold-track)

3. **Go to Settings → Environment Variables**

4. **Add Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api` (your actual backend URL)
   - Apply to: Production, Preview, Development

5. **Redeploy**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

## ✅ Verification

After configuration:

1. Visit: https://gold-track-flax.vercel.app
2. Try logging in at: https://gold-track-flax.vercel.app/admin/login
3. Check browser console (F12) for any errors

## 🐛 Troubleshooting

### "Network Error" or "Failed to fetch"

**Cause**: Backend URL not configured properly

**Fix**:
1. Verify backend is deployed and running
2. Check `VITE_API_URL` in Vercel environment variables
3. Ensure backend URL includes `/api` at the end
4. Check backend CORS settings allow your Vercel domain

### Backend CORS Configuration

Your backend needs to allow requests from Vercel. Update `server/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://gold-track-flax.vercel.app',
    'https://gold-track-*.vercel.app' // Allow all preview deployments
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

### Login Redirects to Home

**Cause**: Missing environment variable

**Fix**: 
1. Add `VITE_API_URL` to Vercel
2. Redeploy the application
3. Hard refresh browser (Ctrl+Shift+R)

## 📱 Testing Locally with Production Backend

If you want to test the production backend locally:

```bash
cd client
echo "VITE_API_URL=https://your-backend-url.onrender.com/api" > .env.local
npm run dev
```

## 🔒 Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use environment variables** in Vercel for sensitive data
3. **Enable CORS** only for your domains
4. **Use HTTPS** for production APIs

## 📞 Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Check backend logs in Render/Railway dashboard
3. Verify all environment variables are set correctly
4. Test backend API directly: `https://your-backend-url.onrender.com/api/health`

---

**Current Status:**
- ✅ Frontend deployed on Vercel
- ⏳ Backend needs to be deployed
- ⏳ Environment variables need to be configured

**Next Step:** Deploy backend using one of the options above, then update `VITE_API_URL` in Vercel.
