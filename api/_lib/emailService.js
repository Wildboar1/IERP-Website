import sgMail from '@sendgrid/mail';

// Initialize API key when function is called to ensure .env is loaded
let initialized = false;

function initializeSendGrid() {
  if (!initialized) {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not set in environment variables');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    initialized = true;
    console.log('✓ SendGrid initialized');
  }
}

export async function sendApplicationEmail(applicationData) {
  // Initialize on first call
  initializeSendGrid();
  try {
    const { fullName, email, department, position } = applicationData;
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Application Received - IERP Law',
      html: `
        <h2>Application Received</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for your interest in joining the <strong>${department.toUpperCase()}</strong> Department${position ? ` as a ${position}` : ''}.</p>
        <p>Your application has been received and is currently under review. We will contact you soon with an update.</p>
        <br>
        <p>Best regards,</p>
        <p>IERP Law Administration Team</p>
      `,
    };

    await sgMail.send(msg);
    console.log('✓ Application email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('✗ SendGrid email error:', error.response?.body || error.message);
    throw error;
  }
}

export async function sendAdminNotification(applicationData) {
  initializeSendGrid();
  try {
    const { fullName, email, department, position, whyJoin } = applicationData;
    const lspdResponses =
      department === 'lspd' && applicationData.lspdQuestions
        ? `
        <h3>LSPD Scenario Responses</h3>
        <ol>
          <li><strong>Why join / approach:</strong> ${applicationData.lspdQuestions.motivation || 'Not provided'}</li>
          <li><strong>Realistic RP view:</strong> ${applicationData.lspdQuestions.realisticRoleplay || 'Not provided'}</li>
          <li><strong>Rude but legal stop:</strong> ${applicationData.lspdQuestions.rudeButNotIllegal || 'Not provided'}</li>
          <li><strong>Officer rule break:</strong> ${applicationData.lspdQuestions.officerMisconduct || 'Not provided'}</li>
          <li><strong>Non-violent refusal:</strong> ${applicationData.lspdQuestions.nonCompliantStop || 'Not provided'}</li>
          <li><strong>Winning vs RP:</strong> ${applicationData.lspdQuestions.balanceWinRp || 'Not provided'}</li>
          <li><strong>Power abuse claim:</strong> ${applicationData.lspdQuestions.abuseAccusation || 'Not provided'}</li>
          <li><strong>Injury RP:</strong> ${applicationData.lspdQuestions.injuryRoleplay || 'Not provided'}</li>
          <li><strong>Officer qualities:</strong> ${applicationData.lspdQuestions.officerQualities || 'Not provided'}</li>
          <li><strong>Handling mistakes:</strong> ${applicationData.lspdQuestions.mistakeHandling || 'Not provided'}</li>
        </ol>
      `
        : '';
    const msg = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `New ${department.toUpperCase()} Application - ${fullName}`,
      html: `
        <h2>New Application Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Department:</strong> ${department.toUpperCase()}</p>
        ${position ? `<p><strong>Position:</strong> ${position}</p>` : ''}
        <p><strong>Why Join:</strong> ${whyJoin}</p>
        ${lspdResponses}
        <br>
        <p>Review this application in the admin dashboard.</p>
      `,
    };

    await sgMail.send(msg);
    console.log('✓ Admin notification sent');
    return { success: true };
  } catch (error) {
    console.error('✗ Admin email error:', error.response?.body || error.message);
    throw error;
  }
}
