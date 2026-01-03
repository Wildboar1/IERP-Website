# Vercel Deployment Instructions for IERP Law Website

## Overview
Vercel is a serverless platform optimized for Next.js, but also great for hosting static sites and serverless functions. We'll deploy your React frontend and Node.js backend to Vercel.

---

## Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub account (Vercel integrates with GitHub)
- Your code pushed to GitHub

---

## Step 1: Prepare Your Project for Vercel

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Create `vercel.json` Configuration
Create a file named `vercel.json` in the root directory with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": [
    "VITE_DISCORD_CLIENT_ID",
    "VITE_API_URL",
    "DISCORD_CLIENT_SECRET",
    "JWT_SECRET",
    "MONGODB_URI",
    "SENDGRID_API_KEY",
    "DISCORD_WEBHOOK_URL",
    "ADMIN_EMAIL"
  ],
  "functions": {
    "api/**": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### 1.3 Create API Routes Directory
```bash
# Create api folder structure for serverless functions
mkdir -p api/auth
mkdir -p api/applications
mkdir -p api/webhook
```

### 1.4 Update `package.json`
Ensure your scripts include:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vercel deploy --prod"
  }
}
```

---

## Step 2: Migrate Backend to Vercel Serverless Functions

### 2.1 Create Auth Endpoint
Create file: `api/auth/callback.js`

```javascript
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  const DISCORD_CLIENT_ID = process.env.VITE_DISCORD_CLIENT_ID;
  const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const JWT_SECRET = process.env.JWT_SECRET;
  const REDIRECT_URI = process.env.VITE_API_URL + '/api/auth/callback';

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      return res.status(400).json({ error: 'Failed to get token' });
    }

    // Get user info
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    // Create JWT token
    const token = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar ? 
          `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.setHeader('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; Max-Age=${7*24*60*60}`);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Auth failed' });
  }
}
```

### 2.2 Create Get User Endpoint
Create file: `api/auth/user.js`

```javascript
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

### 2.3 Create Applications Submit Endpoint
Create file: `api/applications/submit.js`

```javascript
import jwt from 'jsonwebtoken';
import { connectDB } from '../../db/mongoose.js';
import { Application } from '../../models/Application.js';
import { sendApplicationEmail } from '../../services/emailService.js';

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.auth_token;
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectDB();

    const { fullName, email, phone, discord, department, experience, whyJoin, availability } = req.body;

    if (!fullName || !email || !department || !whyJoin) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const application = new Application({
      fullName,
      email,
      phone,
      discord,
      department,
      experience,
      whyJoin,
      availability,
    });

    await application.save();

    try {
      await sendApplicationEmail(req.body);
    } catch (emailError) {
      console.error('Email failed:', emailError);
    }

    res.json({ success: true, message: 'Application submitted', applicationId: application._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 2.4 Create Applications Get Endpoint
Create file: `api/applications/index.js`

```javascript
import jwt from 'jsonwebtoken';
import { connectDB } from '../../db/mongoose.js';
import { Application } from '../../models/Application.js';

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.auth_token;
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectDB();
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 2.5 Create Status Update Endpoint
Create file: `api/applications/[id]/status.js`

```javascript
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../db/mongoose.js';
import { Application } from '../../../models/Application.js';
import { sendApplicationApprovalMessage, sendApplicationRejectionMessage } from '../../../services/discordBotService.js';

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.auth_token;
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const { status, notes } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await connectDB();

    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        reviewNotes: notes,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (status === 'approved') {
      await sendApplicationApprovalMessage(application.discord, application.department);
    } else if (status === 'rejected') {
      await sendApplicationRejectionMessage(application.discord, application.department);
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Login to Vercel
```bash
vercel login
```

### 3.3 Set Environment Variables
```bash
vercel env add VITE_DISCORD_CLIENT_ID
vercel env add DISCORD_CLIENT_SECRET
vercel env add JWT_SECRET
vercel env add MONGODB_URI
vercel env add SENDGRID_API_KEY
vercel env add DISCORD_WEBHOOK_URL
vercel env add ADMIN_EMAIL
vercel env add VITE_API_URL
```

Or set them in Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all variables from your `.env` file

### 3.4 Update API URL
In your `.env` file, update:
```
VITE_API_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
```

### 3.5 Deploy
```bash
npm run build
vercel deploy --prod
```

---

## Step 4: Update Discord OAuth

In Discord Developer Portal:
1. Go to your application
2. OAuth2 → Redirects
3. Update to: `https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback`

---

## Step 5: Update Frontend API Calls

Update your React code to use the new API URL. In your components, use:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'https://YOUR-VERCEL-DOMAIN.vercel.app';

// Example API call
const response = await fetch(`${API_BASE}/api/applications/submit`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

---

## Vercel Deployment URLs

After deployment:

| Component | URL |
|-----------|-----|
| **Website** | `https://YOUR-PROJECT.vercel.app` |
| **API** | `https://YOUR-PROJECT.vercel.app/api/*` |
| **Dashboard** | `https://vercel.com/dashboard` |

---

## Environment Variables Needed

Copy from your `.env` file:
- `VITE_DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `JWT_SECRET`
- `MONGODB_URI`
- `SENDGRID_API_KEY`
- `DISCORD_WEBHOOK_URL`
- `ADMIN_EMAIL`
- `VITE_API_URL` (set after deployment)

---

## Monitoring & Logs

```bash
# View deployment logs
vercel logs

# Check deployment status
vercel status

# Redeploy
vercel deploy --prod
```

---

## Advantages of Vercel

✓ Zero-config deployment
✓ Auto-scaling
✓ Global edge network
✓ Built-in analytics
✓ Simple environment management
✓ Git integration
✓ Free tier with good limits
✓ Serverless functions included

---

## Free Tier Limits

- 100 deployments per day
- Unlimited serverless functions
- 1000 function executions per month (generous)
- 6 GB bandwidth per month

---

## Troubleshooting

### Deployment fails
```bash
vercel logs --tail  # See real-time logs
```

### API calls failing
- Check environment variables in Vercel Dashboard
- Verify API URL in frontend
- Check CORS settings if needed

### MongoDB connection issues
- Add Vercel IP to MongoDB Atlas whitelist
- Or use 0.0.0.0/0 for testing

---

## Next Steps

1. Create the `api/` directory structure with endpoint files
2. Update `vercel.json` with your configuration
3. Set environment variables in Vercel Dashboard
4. Update Discord OAuth redirect URI
5. Update frontend API URL
6. Deploy: `vercel deploy --prod`
7. Test your deployed site

---

Done! Your app will be live on Vercel with automatic deployments on every GitHub push.
