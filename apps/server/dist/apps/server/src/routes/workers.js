import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { workerService } from '../services/workerService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RateType } from '@prisma/client';
const router = Router();
router.use(authenticate);
const workerSchema = z.object({
    name: z.string(),
    phone: z.string().min(9),
    address: z.string(),
    rateType: z.nativeEnum(RateType),
    rate: z.number().nonnegative(),
});
router.get('/', asyncHandler(async (req, res) => {
    const workers = await workerService.getAll();
    res.json({ success: true, data: workers });
}));
router.get('/:id', asyncHandler(async (req, res) => {
    const worker = await workerService.getById(req.params['id']);
    res.json({ success: true, data: worker });
}));
router.post('/', asyncHandler(async (req, res) => {
    const data = workerSchema.parse(req.body);
    const worker = await workerService.create(data);
    res.json({ success: true, data: worker });
}));
router.put('/:id', asyncHandler(async (req, res) => {
    const data = workerSchema.partial().parse(req.body);
    const worker = await workerService.update(req.params['id'], data);
    res.json({ success: true, data: worker });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
    await workerService.delete(req.params['id']);
    res.json({ success: true, data: null });
}));
export default router;
//# sourceMappingURL=workers.js.map