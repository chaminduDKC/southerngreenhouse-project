import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const blacklisted = await prisma.tokenBlacklist.findUnique({
            where: { jti: payload.jti }
        });
        if (blacklisted) {
            return res.status(401).json({ success: false, error: 'Unauthorized: Token expired' });
        }
        req.user = { id: payload.userId };
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }
};
//# sourceMappingURL=auth.js.map