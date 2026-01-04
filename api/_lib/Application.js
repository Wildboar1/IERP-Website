import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  discord: {
    type: String,
    required: true,
  },
  discordId: {
    type: String,
    required: true,
    index: true,
  },
  department: {
    type: String,
    required: true,
    enum: ['doj', 'lspd'],
  },
  position: String,
  experience: String,
  whyJoin: {
    type: String,
    required: true,
  },
  availability: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: Date,
  reviewedBy: String,
  reviewNotes: String,
});

export const Application = mongoose.model('Application', applicationSchema);
