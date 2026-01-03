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
    const mention = /^\d+$/.test(discordId) ? `<@${discordId}>` : `**${discordId}**`;
    
    const payload = {
      content: `✅ **Application Approved**\n\n${mention} - Your **${department.toUpperCase()}** Department application has been **ACCEPTED**! 🎉`,
      username: 'IERP Portal',
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
    const mention = /^\d+$/.test(discordId) ? `<@${discordId}>` : `**${discordId}**`;
    
    const payload = {
      content: `❌ **Application Status Update**\n\n${mention} - Unfortunately, your **${department.toUpperCase()}** Department application was not accepted at this time.`,
      username: 'IERP Portal',
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
