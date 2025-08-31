import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // cookie-parser use karna hoga

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user info attach kar diya
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
