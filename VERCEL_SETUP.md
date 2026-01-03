# Vercel Deployment Setup

## Environment Variables Required

Your Vercel deployment needs these environment variables to function properly:

### 🔴 **CRITICAL - Required for Basic Functionality**

1. **MONGODB_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/ierp?retryWrites=true&w=majority`
   - Get from: [MongoDB Atlas](https://cloud.mongodb.com/)

2. **JWT_SECRET**
   - Secret key for JWT token signing (minimum 32 characters)
   - Example: `super-secret-jwt-key-change-this-in-production-min-32-chars`
   - Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **VITE_DISCORD_CLIENT_ID**
   - Discord OAuth application client ID
   - Get from: [Discord Developer Portal](https://discord.com/developers/applications)

4. **DISCORD_CLIENT_SECRET**
   - Discord OAuth application client secret
   - Get from: [Discord Developer Portal](https://discord.com/developers/applications)

5. **VITE_ADMIN_DISCORD_ID**
   - Your Discord user ID (for admin access)
   - Get by: Enable Developer Mode in Discord > Right-click your profile > Copy ID

### 🟡 **Optional - For Enhanced Features**

6. **DISCORD_BOT_TOKEN** (Optional)
   - For Discord bot notifications
   - Get from: [Discord Developer Portal](https://discord.com/developers/applications) > Bot section

7. **DISCORD_CHANNEL_ID** (Optional)
   - Channel ID where bot sends notifications

8. **SENDGRID_API_KEY** (Optional)
   - For email notifications
   - Get from: [SendGrid](https://sendgrid.com/)

9. **FROM_EMAIL** (Optional)
   - Email address for sending notifications

---

## How to Add Environment Variables to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `ierp-website-sigma` (or similar)

2. **Navigate to Settings**
   - Click **Settings** in the top navigation
   - Click **Environment Variables** in the left sidebar

3. **Add Each Variable**
   - Click **Add** button
   - Enter **Name**: e.g., `MONGODB_URI`
   - Enter **Value**: Your actual value
   - Select **Environment**: Production, Preview, Development (check all)
   - Click **Save**

4. **Repeat for All Variables**
   - Add all required variables from the list above

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **•••** (three dots) on the latest deployment
   - Click **Redeploy**

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add VITE_DISCORD_CLIENT_ID production
vercel env add DISCORD_CLIENT_SECRET production
vercel env add VITE_ADMIN_DISCORD_ID production

# Pull environment variables to local
vercel env pull .env.local

# Redeploy
vercel --prod
```

---

## Verify Environment Variables

After adding variables, check the Vercel deployment logs:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **View Function Logs**
4. Look for error messages about missing variables

If you see errors like:
- `Missing JWT_SECRET environment variable` ✅ Now you'll see exactly what's missing!
- `Missing MONGODB_URI environment variable` ✅ Clear error message

---

## Testing Locally

To test with environment variables locally:

1. Create `.env.local` file (already in .gitignore)
2. Copy contents from `.env.example`
3. Fill in your actual values
4. Run `npm run dev`

---

## Security Notes

⚠️ **NEVER commit `.env` or `.env.local` files to Git**
- These files contain sensitive credentials
- They are already in `.gitignore`
- Use `.env.example` as a template only

✅ **Keep your secrets safe:**
- Use strong, unique values for JWT_SECRET
- Never share your Discord client secret
- Restrict MongoDB access to specific IPs if possible

---

## Current Deployment Status

Your latest deployment should now provide detailed error messages if environment variables are missing, making it much easier to diagnose configuration issues!
