import fetch from 'node-fetch';

console.log('[Discord Service] Loading...');

export async function sendApplicationApprovalMessage(discordId, department) {
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  
  console.log(`\n[WEBHOOK] Approval message - Discord: ${discordId}, Department: ${department}`);
  
  if (!DISCORD_WEBHOOK_URL) {
    console.error('[WEBHOOK] ✗ No webhook URL configured! (DISCORD_WEBHOOK_URL is missing from .env)');
    return;
  }

  try {
    const mention = `<@${discordId}>`;
    
    const payload = {
      content: `✅ **Application Approved**\n\n${mention} - Your **${department.toUpperCase()}** Department application has been **ACCEPTED**! 🎉`,
      username: 'SASP HR',
      avatar_url: 'https://ierp-website-sigma.vercel.app/sasp%20logo.webp'
    };

    console.log('[WEBHOOK] Webhook URL:', DISCORD_WEBHOOK_URL.substring(0, 50) + '...');
    console.log('[WEBHOOK] Payload:', JSON.stringify(payload));

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('[WEBHOOK] Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('[WEBHOOK] ✗ Error:', response.status, error);
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    console.log('[WEBHOOK] ✓ Message sent successfully');
  } catch (error) {
    console.error('[WEBHOOK] ✗ Failed:', error.message);
    throw error;
  }
}

export async function sendApplicationRejectionMessage(discordId, department) {
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  
  console.log(`\n[WEBHOOK] Rejection message - Discord: ${discordId}, Department: ${department}`);
  
  if (!DISCORD_WEBHOOK_URL) {
    console.error('[WEBHOOK] ✗ No webhook URL configured! (DISCORD_WEBHOOK_URL is missing from .env)');
    return;
  }

  try {
    const mention = `<@${discordId}>`;
    
    const payload = {
      content: `❌ **Application Status Update**\n\n${mention} - Unfortunately, your **${department.toUpperCase()}** Department application was not accepted at this time.`,
      username: 'SASP HR',
      avatar_url: 'https://ierp-website-sigma.vercel.app/sasp%20logo.webp'
    };

    console.log('[WEBHOOK] Webhook URL:', DISCORD_WEBHOOK_URL.substring(0, 50) + '...');
    console.log('[WEBHOOK] Payload:', JSON.stringify(payload));

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('[WEBHOOK] Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('[WEBHOOK] ✗ Error:', response.status, error);
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    console.log('[WEBHOOK] ✓ Message sent successfully');
  } catch (error) {
    console.error('[WEBHOOK] ✗ Failed:', error.message);
    throw error;
  }
}

export async function sendApplicationLogMessage(applicationData) {
  const DISCORD_LOG_WEBHOOK_URL = process.env.DISCORD_LOG_WEBHOOK_URL;
  
  console.log(`\n[LOG WEBHOOK] Application submitted - ID: ${applicationData.discordId}`);
  
  if (!DISCORD_LOG_WEBHOOK_URL) {
    console.error('[LOG WEBHOOK] ✗ No log webhook URL configured! (DISCORD_LOG_WEBHOOK_URL is missing from .env)');
    return;
  }

  try {
    const embed = {
      title: '📝 New Application Submitted',
      color: 0x3498db, // Blue color
      fields: [
        {
          name: '👤 Applicant',
          value: applicationData.fullName,
          inline: true
        },
        {
          name: '🎮 Discord',
          value: `<@${applicationData.discordId}>\n${applicationData.discord}`,
          inline: true
        },
        {
          name: '🏢 Department',
          value: applicationData.department.toUpperCase(),
          inline: true
        },
        {
          name: '📧 Email',
          value: applicationData.email,
          inline: true
        },
        {
          name: '📱 Phone',
          value: applicationData.phone || 'Not provided',
          inline: true
        },
        {
          name: '🆔 Discord ID',
          value: applicationData.discordId,
          inline: true
        },
        {
          name: '💼 Experience',
          value: applicationData.experience || 'Not provided',
          inline: false
        },
        {
          name: '❓ Why Join',
          value: applicationData.whyJoin,
          inline: false
        },
        {
          name: '⏰ Availability',
          value: applicationData.availability || 'Not specified',
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'IERP Application System'
      }
    };
    
    const payload = {
      embeds: [embed],
      username: 'Application Logger',
      avatar_url: 'https://ierp-website-sigma.vercel.app/sasp%20logo.webp'
    };

    console.log('[LOG WEBHOOK] Sending to:', DISCORD_LOG_WEBHOOK_URL.substring(0, 50) + '...');

    const response = await fetch(DISCORD_LOG_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('[LOG WEBHOOK] Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('[LOG WEBHOOK] ✗ Error:', response.status, error);
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    console.log('[LOG WEBHOOK] ✓ Application log sent successfully');
  } catch (error) {
    console.error('[LOG WEBHOOK] ✗ Failed:', error.message);
    throw error;
  }
}
