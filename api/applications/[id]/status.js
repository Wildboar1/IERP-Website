import jwt from 'jsonwebtoken';
import { connectDB } from '../../_lib/mongoose.js';
import { Application } from '../../_lib/Application.js';
import { sendApplicationApprovalMessage, sendApplicationRejectionMessage } from '../../_lib/discordBotService.js';

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
  // Enhanced logging for debugging
  console.log('\n========== STATUS ENDPOINT DEBUG ==========');
  console.log('[status.js] Timestamp:', new Date().toISOString());
  console.log('[status.js] Method:', req.method);
  console.log('[status.js] URL:', req.url);
  console.log('[status.js] Query params:', req.query);
  console.log('[status.js] Headers:', {
    origin: req.headers.origin,
    'content-type': req.headers['content-type'],
    cookie: req.headers.cookie ?  'Present' : 'Missing'
  });
  
  // Set CORS headers FIRST (before any other logic)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    console.log('[status.js] ✓ Handling OPTIONS preflight');
    console.log('==========================================\n');
    return res.status(200).end();
  }

  // Validate HTTP method
  if (req.method !== 'PATCH') {
    console.log('[status.js] ✗ Method not allowed');
    console.log('[status.js] Expected: PATCH');
    console.log('[status.js] Received:', req.method);
    console.log('==========================================\n');
    return res.status(405).json({
      error: 'Method not allowed',
      received: req.method,
      expected: 'PATCH'
    });
  }

  console.log('[status.js] ✓ Method is PATCH');

  // Parse and verify authentication token
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.auth_token || req.cookies?.auth_token;
  
  console.log('[status.js] Auth token present:', !!token);
  
  const user = verifyToken(token);
  if (!user) {
    console.log('[status.js] ✗ Unauthorized - Invalid or missing token');
    console.log('==========================================\n');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('[status.js] ✓ Authenticated user:', user.username);

  // Extract parameters
  const { id } = req.query;
  const { status, notes } = req.body;

  console.log('[status.js] Application ID:', id);
  console.log('[status.js] New status:', status);
  console.log('[status.js] Notes:', notes ?  'Present' : 'None');

  // Validate ID parameter
  if (!id) {
    console.log('[status.js] ✗ Missing application ID');
    console.log('==========================================\n');
    return res.status(400).json({ error: 'Missing application ID' });
  }

  // Validate status value
  if (! ['pending', 'approved', 'rejected'].includes(status)) {
    console.log('[status.js] ✗ Invalid status value');
    console.log('==========================================\n');
    return res.status(400).json({ 
      error: 'Invalid status',
      received: status,
      allowed: ['pending', 'approved', 'rejected']
    });
  }

  console.log('[status.js] ✓ Status validation passed');

  try {
    console.log('[status.js] → Connecting to database...');
    await connectDB();
    console.log('[status.js] ✓ Database connected');

    console.log('[status.js] → Updating application...');
    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        reviewNotes: notes,
        reviewedAt: new Date(),
        reviewedBy: user.username,
      },
      { new: true }
    );

    if (!application) {
      console.log('[status.js] ✗ Application not found');
      console.log('==========================================\n');
      return res.status(404).json({ error: 'Application not found' });
    }

    console.log('[status.js] ✓ Application updated successfully');
    console.log('[status.js] Application details: ');
    console.log('  - Name:', application.fullName);
    console.log('  - Discord:', application.discord);
    console.log('  - Department:', application.department);
    console.log('  - New Status:', status);

    // Send Discord notification
    if (status === 'approved' || status === 'rejected') {
      console.log('[status.js] → Sending Discord notification.. .');
      try {
        if (status === 'approved') {
          await sendApplicationApprovalMessage(application.discord, application.department);
          console.log('[status.js] ✓ Approval notification sent');
        } else {
          await sendApplicationRejectionMessage(application.discord, application.department);
          console.log('[status.js] ✓ Rejection notification sent');
        }
      } catch (discordError) {
        console.error('[status.js] !  Discord notification failed:', discordError.message);
        console.error('[status.js] (Continuing despite Discord error)');
      }
    }

    console.log('[status.js] ✓ Request completed successfully');
    console.log('==========================================\n');
    
    return res.status(200).json(application);
  } catch (error) {
    console.error('[status.js] ✗ Error during update: ');
    console.error('[status.js] Error message:', error.message);
    console.error('[status.js] Error stack:', error.stack);
    console.log('==========================================\n');
    
    return res.status(500).json({ 
      error: 'Failed to update application',
      details: error.message 
    });
  }
}