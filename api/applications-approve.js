import jwt from 'jsonwebtoken';
import { connectDB } from './_lib/mongoose.js';
import { Application } from './_lib/Application.js';
import { sendApplicationApprovalMessage } from './_lib/discordBotService.js';

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }
  return cookies;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.error('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed', received: req.method, expected: 'POST' });
  }

  // Validate environment variables
  if (!process.env.JWT_SECRET) {
    console.error('Missing JWT_SECRET environment variable');
    return res.status(500).json({ error: 'Server configuration error', details: 'Missing JWT_SECRET' });
  }
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI environment variable');
    return res.status(500).json({ error: 'Server configuration error', details: 'Missing MONGODB_URI' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.auth_token || req.cookies?.auth_token;
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { applicationId, notes } = req.body;

  if (!applicationId) {
    return res.status(400).json({ error: 'Application ID is required' });
  }

  try {
    await connectDB();

    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        status: 'approved',
        reviewNotes: notes,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    try {
      await sendApplicationApprovalMessage(application.discord, application.department);
    } catch (discordError) {
      console.error('Discord notification failed:', discordError);
    }

    console.log('✓ Application approved:', applicationId);
    res.json(application);
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack?.split('\n')[0],
      step: 'database_operation'
    });
  }
}
