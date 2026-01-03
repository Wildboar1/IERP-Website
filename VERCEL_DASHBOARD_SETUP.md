# ✅ SKIP CLI - Use Vercel Dashboard Instead

## Problem
When using `vercel env add`, it's asking for the wrong directory path.

## Solution: Use Vercel Dashboard

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Sign in with your account
3. Click on your project **"ierp-law-website"** (or "ierp law")

### Step 2: Set Environment Variables in Dashboard
1. Go to **Settings**
2. Click on **Environment Variables**
3. Click **Add New**
4. Add each variable:

```
VITE_DISCORD_CLIENT_ID = 1456902738981159027
VITE_API_URL = https://ierp-law-website.vercel.app  (update after first deploy)
DISCORD_CLIENT_SECRET = a3mZhMKNwikfxOxMHbn6F_-2r1DFzfOW
JWT_SECRET = ierp_law_website_secret_key_2024
MONGODB_URI = mongodb+srv://preetjoshi012_db_user:UDHqlNLE5LOSqvKW@ierpwebsite.08jytmn.mongodb.net/?appName=ierpwebsite
SENDGRID_API_KEY = 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
DISCORD_WEBHOOK_URL = https://discord.com/api/webhooks/1456921295542554648/nmQvhb3Wv6JpcJsMdbLMaTUIL3VYQ5guqFQvMvmCjSN83Nv_Vp0LDSlW99n-13PwTAez
ADMIN_EMAIL = preetjoshi012@gmail.com
```

5. Click **Save** for each one

### Step 3: Deploy from Dashboard
1. Go to **Deployments** tab
2. Click **Redeploy** latest commit
3. Wait for deployment to complete

### Step 4: Get Your URL
After deployment:
- Your URL will be shown in the dashboard
- Example: `https://ierp-law-website.vercel.app`
- Update `VITE_API_URL` with this URL

## Why Dashboard is Better
✓ No command line issues
✓ All variables saved in one place
✓ Can easily edit or delete variables
✓ See deployment history
✓ No path errors

---

**Skip the CLI commands and just use the dashboard!** 🎉
