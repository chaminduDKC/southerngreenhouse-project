import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

router.post('/login', loginRateLimiter, asyncHandler(async (req, res) => {
  console.log("Called login")
  const { email, password } = loginSchema.parse(req.body);
  console.log(email, password);
  

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const jti = uuidv4();
  const token = jwt.sign({ userId: user.id, jti }, JWT_SECRET, { expiresIn: '8h' });

  res.json({ success: true, data: { accessToken: token, user: { id: user.id, email: user.email } } });
}));

router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  const token = req.headers.authorization!.split(' ')[1];
  const payload = jwt.decode(token) as any;
  
  if (payload && payload.jti) {
    const expiresAt = new Date((payload.exp || 0) * 1000);
    await prisma.tokenBlacklist.create({
      data: { jti: payload.jti, expiresAt }
    });
  }

  res.json({ success: true, data: null });
}));

export default router;
