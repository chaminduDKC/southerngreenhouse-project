import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { dashboardService } from '../services/dashboardService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate);

const handler = asyncHandler(async (_req, res) => {
  const stats = await dashboardService.getStats();
  res.json({ success: true, data: stats });
});

// Accept both /api/dashboard and /api/dashboard/stats
router.get('/', handler);
router.get('/stats', handler);

export default router;
