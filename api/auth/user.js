import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}