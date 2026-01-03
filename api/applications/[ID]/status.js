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