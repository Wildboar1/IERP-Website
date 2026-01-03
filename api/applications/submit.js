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