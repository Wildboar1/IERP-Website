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
    
    // Email to admin
    await sgMail.send({
      to: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL,
      subject: `New Application: ${fullName} - ${department.toUpperCase()}`,
      html: `
        <h2>New Department Application Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Discord:</strong> ${applicationData.discord}</p>
        <p><strong>Department:</strong> ${department.toUpperCase()}</p>
        <p><strong>Position:</strong> ${position || 'Not specified'}</p>
        <p><strong>Phone:</strong> ${applicationData.phone || 'Not provided'}</p>
        <p><strong>Why they want to join:</strong></p>
        <p>${applicationData.whyJoin}</p>
        <p><strong>Availability:</strong> ${applicationData.availability || 'Not specified'}</p>
        <p><strong>Experience:</strong></p>
        <p>${applicationData.experience || 'Not provided'}</p>
        ${lspdResponses}
        <hr/>
        <p><a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5173'}/admin/applications">View in Admin Dashboard</a></p>
      `,
    });

    // Confirmation email to applicant
    await sgMail.send({
      to: email,
      from: process.env.ADMIN_EMAIL,
      subject: 'Your Application Has Been Received - Indian Empire RP',
      html: `
        <h2>Application Received</h2>
        <p>Hello ${fullName},</p>
        <p>Thank you for applying to the ${department.toUpperCase()} department at Indian Empire RP!</p>
        <p>We have received your application and will review it shortly. You will be notified of the outcome via email.</p>
        <p>Best regards,<br/>Indian Empire RP Administration</p>
      `,
    });

    console.log('✓ Application emails sent');
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
