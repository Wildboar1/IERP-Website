import jwt from 'jsonwebtoken';
import { connectDB } from '../_lib/mongoose.js';
import { Application } from '../_lib/Application.js';
import { sendApplicationEmail } from '../_lib/emailService.js';
import { sendApplicationLogMessage } from '../_lib/discordBotService.js';

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// Helper to parse cookies
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
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.auth_token || req.cookies?.auth_token;
  const user = verifyToken(token);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectDB();

    const { fullName, email, phone, discord, department, experience, whyJoin, availability, lspdQuestions } = req.body;
    const isLspd = department === 'lspd';
    const requiredLspdKeys = [
      'motivation',
      'realisticRoleplay',
      'rudeButNotIllegal',
      'officerMisconduct',
      'nonCompliantStop',
      'balanceWinRp',
      'abuseAccusation',
      'injuryRoleplay',
      'officerQualities',
      'mistakeHandling',
    ];
    const trimmedLspdQuestions = isLspd
      ? Object.fromEntries(requiredLspdKeys.map((key) => [key, (lspdQuestions?.[key] || '').trim()]))
      : undefined;

    const missingLspdResponses = isLspd
      ? requiredLspdKeys.filter((key) => !trimmedLspdQuestions?.[key])
      : [];

    if (!fullName || !email || !department || !whyJoin || missingLspdResponses.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user has already submitted an application (unless they are an admin)
    if (!user.isAdmin) {
      const existingApplication = await Application.findOne({ discordId: user.id });
      if (existingApplication) {
        return res.status(400).json({ 
          error: 'You have already submitted an application',
          message: 'Each user can only submit one application. Contact an admin if you need to reapply.'
        });
      }
    }

    const application = new Application({
      fullName,
      email,
      phone,
      discord,
      discordId: user.id,
      department,
      experience,
      whyJoin,
      availability,
      lspdQuestions: trimmedLspdQuestions,
    });

    await application.save();

    try {
      await sendApplicationEmail({
        fullName,
        email,
        phone,
        discord,
        department,
        experience,
        whyJoin,
        availability,
        lspdQuestions: trimmedLspdQuestions,
      });
    } catch (emailError) {
      console.error('Email failed:', emailError);
    }

    // Send application log to Discord admin channel
    try {
      await sendApplicationLogMessage(application);
    } catch (discordError) {
      console.error('Discord log webhook failed:', discordError);
      // Continue even if Discord webhook fails
    }

    res.json({ success: true, message: 'Application submitted', applicationId: application._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}