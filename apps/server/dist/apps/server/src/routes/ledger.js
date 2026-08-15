import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { ledgerService } from '../services/ledgerService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { TargetType } from '@prisma/client';
const router = Router();
router.use(authenticate);
const ledgerSchema = z.object({
    date: z.string().datetime(),
    openingBalance: z.number(),
    paymentGivenToday: z.number(),
    balanceReturnedToday: z.number(),
    workerAdvances: z.array(z.object({
        workerId: z.string(),
        advanceAmount: z.number(),
        targetType: z.nativeEnum(TargetType).optional(),
        targetId: z.string().optional()
    })),
    completedProjects: z.array(z.object({
        targetType: z.nativeEnum(TargetType),
        targetId: z.string()
    })),
    allocatedProjects: z.array(z.object({
        targetType: z.nativeEnum(TargetType),
        targetId: z.string()
    })).optional()
});
router.get('/', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const result = await ledgerService.getAll(page, pageSize);
    res.json({ success: true, ...result }); // Using root wrapper properties instead of nested data for paginated response
}));
router.get('/:id', asyncHandler(async (req, res) => {
    const entry = await ledgerService.getById(req.params['id']);
    res.json({ success: true, data: entry });
}));
router.post('/', asyncHandler(async (req, res) => {
    const data = ledgerSchema.parse(req.body);
    const entry = await ledgerService.create(data);
    res.json({ success: true, data: entry });
}));
router.put('/:id', asyncHandler(async (req, res) => {
    try {
        const data = ledgerSchema.partial().parse(req.body);
        const entry = await ledgerService.update(req.params['id'], data);
        res.json({ success: true, data: entry });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}));
router.delete('/:id', asyncHandler(async (req, res) => {
    console.log("Id id ", req.params['id']);
    try {
        await ledgerService.delete(req.params['id']);
        res.json({ success: true, data: null });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}));
export default router;
//# sourceMappingURL=ledger.js.map