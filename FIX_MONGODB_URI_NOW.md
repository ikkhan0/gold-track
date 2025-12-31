# 🚨 URGENT FIX: Remove directConnection from MongoDB URI

## Problem Found ✅
Your `MONGO_URI` environment variable in Vercel contains `directConnection=true` which doesn't work with MongoDB Atlas.

## Fix Right Now (2 Minutes)

### Step 1: Check Your Current MongoDB URI
Your connection string probably looks like this:
```
mongodb+srv://imrankhan:imran123@cluster0.c0fdr.mongodb.net/loadboard_db?retryWrites=true&w=majority&directConnection=true
```

### Step 2: Remove directConnection Parameter

**CORRECT MongoDB URI (use this):**
```
mongodb+srv://imrankhan:imran123@cluster0.c0fdr.mongodb.net/loadboard_db?retryWrites=true&w=majority
```

Notice: **Removed `&directConnection=true`**

### Step 3: Update in Vercel

1. Go to: https://vercel.com/imran-khans-projects-01901877/gold-track/settings/environment-variables

2. Find `MONGO_URI` variable

3. Click "Edit" (pencil icon)

4. Replace the value with the corrected URI (without `directConnection=true`)

5. Make sure it's enabled for: **Production**, **Preview**, **Development**

6. Click "Save"

### Step 4: Redeploy

After saving the environment variable:

1. Go to: https://vercel.com/imran-khans-projects-01901877/gold-track

2. Click "Deployments" tab

3. Click "..." (three dots) on the latest deployment

4. Click "Redeploy"

OR simply trigger a new deployment:
```bash
git commit --allow-empty -m "trigger deployment"
git push
```

### Step 5: Test (After 2 Minutes)

1. **Health Check**: https://gold-track-8ag3nwwhk-imran-khans-projects-01901877.vercel.app/api/
   - Should show: `"dbConnected": true`

2. **Admin Login**: https://gold-track-8ag3nwwhk-imran-khans-projects-01901877.vercel.app/admin/login
   - Login with: `admin@goldtrack.pk` / `admin123`
   - Should redirect to dashboard ✅

---

## Alternative: Get Correct URI from MongoDB Atlas

If you're not sure of your connection string:

1. Go to https://cloud.mongodb.com/
2. Log into your account
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. **IMPORTANT**: Replace `<password>` with your actual password
7. **IMPORTANT**: Replace `<database>` with `loadboard_db`
8. **MAKE SURE** the string does NOT have `&directConnection=true`

Correct format:
```
mongodb+srv://<username>:<password>@cluster0.c0fdr.mongodb.net/<database>?retryWrites=true&w=majority
```

---

## Why This Happens

**`directConnection=true`** tells MongoDB to connect to a single server.

**MongoDB Atlas** uses replica sets (multiple servers), so it needs `directConnection=false` or the parameter should be omitted entirely.

When you have `directConnection=true` with a replica set, MongoDB throws the error:
> "directConnection option requires exactly one host"

---

## Quick Check

After updating and redeploying, you should see:

✅ `/api/` returns `{"dbConnected": true}`
✅ `/api/debug/db` returns user count and database info  
✅ Admin login works and redirects to dashboard

If you still see errors, share the new error message with me!
