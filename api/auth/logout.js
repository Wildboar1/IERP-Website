export default function handler(req, res) {
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

  // Clear the auth cookie
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
  const cookieOptions = [
    'auth_token=',
    'Path=/',
    'HttpOnly',
    'Max-Age=0',
    'SameSite=Lax',
    ...(isProduction ? ['Secure'] : [])
  ].join('; ');
  
  res.setHeader('Set-Cookie', cookieOptions);
  res.json({ success: true, message: 'Logged out successfully' });
}
