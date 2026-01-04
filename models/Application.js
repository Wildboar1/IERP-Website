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
    required: false,
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
  lspdQuestions: {
    motivation: String,
    realisticRoleplay: String,
    rudeButNotIllegal: String,
    officerMisconduct: String,
    nonCompliantStop: String,
    balanceWinRp: String,
    abuseAccusation: String,
    injuryRoleplay: String,
    officerQualities: String,
    mistakeHandling: String,
  },
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
