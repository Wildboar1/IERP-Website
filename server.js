import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { connectDB } from './db/mongoose.js';
import { Application } from './models/Application.js';
import { sendApplicationEmail } from './services/emailService.js';
import { sendApplicationApprovalMessage, sendApplicationRejectionMessage, sendApplicationLogMessage } from './services/discordBotService.js';

dotenv.config();

const app = express();
const DISCORD_CLIENT_ID = process.env.VITE_DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5173/auth/callback';

console.log('Server Config:');
console.log('CLIENT_ID:', DISCORD_CLIENT_ID ? '✓ Set' : '✗ Missing');
console.log('CLIENT_SECRET:', DISCORD_CLIENT_SECRET ? '✓ Set' : '✗ Missing');
console.log('JWT_SECRET:', JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('REDIRECT_URI:', REDIRECT_URI);

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(cookieParser());

// Verify JWT middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get current user
app.get('/api/auth/user', (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// OAuth callback handler
app.post('/api/auth/callback', async (req, res) => {
  const { code } = req.body;
  
  console.log('Auth callback received with code:', code ? '✓' : '✗');

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    console.log('Exchanging code for Discord token...');
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    console.log('Discord token response:', tokenData.access_token ? '✓ Got token' : '✗ No token', tokenData.error ? `Error: ${tokenData.error}` : '');
    
    if (tokenData.error) {
      console.error('Discord API Error:', {
        error: tokenData.error,
        error_description: tokenData.error_description,
        code_sent: code ? '✓' : '✗',
        redirect_uri: REDIRECT_URI,
      });
    }

    if (!tokenData.access_token) {
      console.error('Full token error response:', tokenData);
      return res.status(400).json({ error: 'Failed to get access token', details: tokenData });
    }

    // Get user info from Discord
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    
    console.log('User data retrieved:', userData.id ? `✓ ID: ${userData.id}` : '✗ No user ID');

    // Check if user is admin
    const ADMIN_DISCORD_IDS = (process.env.ADMIN_DISCORD_IDS || '')
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);
    const isAdmin = ADMIN_DISCORD_IDS.includes(userData.id);
    
    console.log('Admin IDs configured:', ADMIN_DISCORD_IDS);
    console.log('User is admin:', isAdmin);

    // Create user object
    const user = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar
        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : null,
      isAdmin: isAdmin,
    };
    
    console.log('Creating JWT token for user:', user.id);

    // Create JWT token
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log('✓ User authenticated successfully:', user.username);
    res.json(user);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

// Submit application
app.post('/api/applications/submit', verifyToken, async (req, res) => {
  try {
    console.log('New application submission...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Connect to MongoDB if not already connected
    await connectDB();
    
    const { fullName, email, phone, discord, department, experience, whyJoin, availability } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !department || !whyJoin) {
      console.log('Validation failed:', { fullName: !!fullName, email: !!email, department: !!department, whyJoin: !!whyJoin });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create application
    const application = new Application({
      fullName,
      email,
      phone,
      discord,
      discordId: req.user.id,
      department,
      experience,
      whyJoin,
      availability,
    });
    
    console.log('Application object created:', {
      fullName,
      email,
      phone,
      discord,
      discordId: req.user.id,
      department,
      experience,
      whyJoin,
      availability,
    });
    
    console.log('Saving to database...');
    await application.save();
    console.log('✓ Application saved to database with ID:', application._id);
    
    // Send email notification
    try {
      console.log('Sending email notification...');
      await sendApplicationEmail({
        fullName,
        email,
        phone,
        discord,
        department,
        experience,
        whyJoin,
        availability,
      });
      console.log('✓ Email sent successfully');
    } catch (emailError) {
      console.error('Warning: Email notification failed (but application was saved):', emailError.message);
    }
    
    // Send Discord log webhook
    try {
      console.log('Sending Discord log notification...');
      await sendApplicationLogMessage(application);
      console.log('✓ Discord log sent successfully');
    } catch (discordError) {
      console.error('Warning: Discord log failed (but application was saved):', discordError.message);
    }
    
    res.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: application._id 
    });
  } catch (error) {
    console.error('Application submission error:', error.message);
    console.error('Full error stack:', error);
    res.status(500).json({ error: 'Failed to submit application', details: error.message });
  }
});

// Get all applications (admin only)
app.get('/api/applications', verifyToken, async (req, res) => {
  try {
    await connectDB();
    
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get application by ID
app.get('/api/applications/:id', verifyToken, async (req, res) => {
  try {
    await connectDB();
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Update application status (admin only)
app.patch('/api/applications/:id/status', verifyToken, async (req, res) => {
  console.log('\n========== STATUS UPDATE ENDPOINT ==========');
  console.log('Admin User:', req.user?.username);
  console.log('Application ID:', req.params.id);
  console.log('New Status:', req.body.status);
  
  try {
    await connectDB();
    
    const { status, notes } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes: notes,
        reviewedAt: new Date(),
        reviewedBy: req.user.username,
      },
      { new: true }
    );
    
    if (!application) {
      console.log('✗ Application not found');
      return res.status(404).json({ error: 'Application not found' });
    }
    
    console.log('✓ Application updated:');
    console.log('  - Name:', application.fullName);
    console.log('  - Discord:', application.discord);
    console.log('  - Department:', application.department);
    console.log('  - New Status:', status);
    
    // Send Discord message if approved or rejected
    if (status === 'approved' || status === 'rejected') {
      console.log('\n→ Attempting to send Discord webhook...');
      try {
        if (status === 'approved') {
          await sendApplicationApprovalMessage(application.discord, application.department);
        } else {
          await sendApplicationRejectionMessage(application.discord, application.department);
        }
      } catch (discordError) {
        console.error('! Discord send failed (but continuing):', discordError.message);
      }
    }
    
    console.log('========== END STATUS UPDATE ==========\n');
    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Approve application
app.post('/api/applications-approve', verifyToken, async (req, res) => {
  console.log('\n========== APPROVE APPLICATION ==========');
  console.log('Admin User:', req.user?.username);
  console.log('Request body:', req.body);
  
  try {
    await connectDB();
    
    const { applicationId } = req.body;
    
    if (!applicationId) {
      return res.status(400).json({ error: 'Missing applicationId' });
    }
    
    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: req.user.username,
      },
      { new: true }
    );
    
    if (!application) {
      console.log('✗ Application not found');
      return res.status(404).json({ error: 'Application not found' });
    }
    
    console.log('✓ Application approved:', application.fullName);
    
    // Send Discord approval message
    try {
      console.log('Sending Discord approval message...');
      await sendApplicationApprovalMessage(application.discordId, application.department);
      console.log('✓ Discord message sent');
    } catch (discordError) {
      console.error('Discord send failed:', discordError.message);
    }
    
    console.log('========== END APPROVE ==========\n');
    res.json({ success: true, application });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ error: 'Failed to approve application' });
  }
});

// Reject application
app.post('/api/applications-reject', verifyToken, async (req, res) => {
  console.log('\n========== REJECT APPLICATION ==========');
  console.log('Admin User:', req.user?.username);
  console.log('Request body:', req.body);
  
  try {
    await connectDB();
    
    const { applicationId } = req.body;
    
    if (!applicationId) {
      return res.status(400).json({ error: 'Missing applicationId' });
    }
    
    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedBy: req.user.username,
      },
      { new: true }
    );
    
    if (!application) {
      console.log('✗ Application not found');
      return res.status(404).json({ error: 'Application not found' });
    }
    
    console.log('✓ Application rejected:', application.fullName);
    
    // Send Discord rejection message
    try {
      console.log('Sending Discord rejection message...');
      await sendApplicationRejectionMessage(application.discordId, application.department);
      console.log('✓ Discord message sent');
    } catch (discordError) {
      console.error('Discord send failed:', discordError.message);
    }
    
    console.log('========== END REJECT ==========\n');
    res.json({ success: true, application });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ error: 'Failed to reject application' });
  }
});

// Test Discord webhook endpoint
app.post('/api/test-webhook', async (req, res) => {
  console.log('=== TEST WEBHOOK ENDPOINT CALLED ===');
  try {
    const { discordId, department } = req.body;
    console.log('Testing webhook with:');
    console.log('- Discord ID:', discordId);
    console.log('- Department:', department);
    console.log('- Webhook URL configured:', process.env.DISCORD_WEBHOOK_URL ? '✓ Yes' : '✗ No');
    
    await sendApplicationApprovalMessage(discordId || 'preetjoshi', department || 'lspd');
    res.json({ success: true, message: 'Webhook test sent' });
  } catch (error) {
    console.error('Webhook test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reset specific applications to pending
app.post('/api/applications/reset-to-pending', verifyToken, async (req, res) => {
  try {
    await connectDB();
    const { names } = req.body;
    
    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: 'Names array required' });
    }
    
    const result = await Application.updateMany(
      { fullName: { $in: names } },
      { $set: { status: 'pending', reviewedAt: null, reviewedBy: null, reviewNotes: null } }
    );
    
    console.log(`Reset ${result.modifiedCount} applications to pending:`, names);
    res.json({ success: true, modifiedCount: result.modifiedCount, names });
  } catch (error) {
    console.error('Reset applications error:', error);
    res.status(500).json({ error: 'Failed to reset applications' });
  }
});

// Delete all test applications (development only)
app.delete('/api/applications/clear-all', verifyToken, async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not allowed in production' });
  }
  
  try {
    await connectDB();
    const result = await Application.deleteMany({});
    console.log(`Deleted ${result.deletedCount} applications`);
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Delete applications error:', error);
    res.status(500).json({ error: 'Failed to delete applications' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Auth server running on port ${PORT}`);
  
  // Test MongoDB connection on startup
  try {
    await connectDB();
    console.log('✓ MongoDB connection verified on startup');
  } catch (error) {
    console.error('✗ MongoDB connection failed on startup:', error.message);
  }
});
