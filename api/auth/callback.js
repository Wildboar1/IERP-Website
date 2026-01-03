const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  const DISCORD_CLIENT_ID = process.env.VITE_DISCORD_CLIENT_ID;
  const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const JWT_SECRET = process.env.JWT_SECRET;
  
  // Construct the redirect URI based on the host
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const REDIRECT_URI = `${protocol}://${host}/api/auth/callback`;

  console.log("Callback handler - REDIRECT_URI:", REDIRECT_URI);
  console.log("Received code:", code ? "✓" : "✗");
  console.log("DISCORD_CLIENT_ID:", DISCORD_CLIENT_ID ? "✓" : "✗");
  console.log("DISCORD_CLIENT_SECRET:", DISCORD_CLIENT_SECRET ? "✓" : "✗");
  console.log("JWT_SECRET:", JWT_SECRET ? "✓" : "✗");

  try {
    // Use built-in Node.js fetch (Node 18+)
    // Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error("Token exchange failed:", tokenData);
      return res.status(400).json({ error: 'Failed to get token', details: tokenData });
    }

    console.log("✓ Got Discord access token");

    // Get user info
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();
    console.log("✓ Got user data:", userData.username);

    // Create JWT token
    const token = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar ? 
          `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.setHeader('Set-Cookie', `auth_token=${token}; Path=/; HttpOnly; Max-Age=${7*24*60*60}`);
    res.json({ success: true, token, user: userData });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: 'Auth failed', message: error.message });
  }
};