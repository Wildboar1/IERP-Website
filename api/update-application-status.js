import jwt from 'jsonwebtoken';
import { connectDB } from './lib/mongoose.js';
import { Application } from './lib/Application.js';
import { sendApplicationApprovalMessage, sendApplicationRejectionMessage } from './lib/discordBotService.js';

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
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.auth_token || req.cookies?.auth_token;
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Receive applicationId from body (matching the frontend change)
  const { applicationId, status, notes } = req.body;

  if (!applicationId) {
    return res.status(400).json({ error: 'Application ID is required' });
  }

  try {
    await connectDB();

    const application = await Application.findByIdAndUpdate(
      applicationId,
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

    // Send Discord Notifications
    if (status === 'approved') {
      try {
        await sendApplicationApprovalMessage(application.discord, application.department);
      } catch (err) { console.error("Discord Error", err); }
    } else if (status === 'rejected') {
      try {
        await sendApplicationRejectionMessage(application.discord, application.department);
      } catch (err) { console.error("Discord Error", err); }
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}