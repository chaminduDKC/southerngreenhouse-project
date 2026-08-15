import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { inventoryService } from '../services/inventoryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { TargetType } from '@prisma/client';
const router = Router();
router.use(authenticate);
const inventorySchema = z.object({
    name: z.string(),
    unit: z.string(),
    unitSize: z.number(),
    boughtPrice: z.number(),
    soldPrice: z.number(),
    quantity: z.number(),
    lowStockThreshold: z.number()
});
const allocateSchema = z.object({
    inventoryItemId: z.string(),
    rows: z.array(z.object({
        targetType: z.nativeEnum(TargetType),
        targetId: z.string(),
        quantity: z.number().positive()
    })).min(1)
});
router.get('/', asyncHandler(async (req, res) => {
    const search = req.query.search;
    const items = await inventoryService.getAll(search);
    res.json({ success: true, data: items });
}));
router.get('/allocation-targets', asyncHandler(async (req, res) => {
    const targets = await inventoryService.getEligibleTargets();
    res.json({ success: true, data: targets });
}));
router.post('/allocate', asyncHandler(async (req, res) => {
    const data = allocateSchema.parse(req.body);
    const allocations = await inventoryService.allocate(data);
    res.json({ success: true, data: allocations });
}));
router.get('/:id', asyncHandler(async (req, res) => {
    const item = await inventoryService.getById(req.params['id']);
    res.json({ success: true, data: item });
}));
router.get('/:id/allocations', asyncHandler(async (req, res) => {
    const allocs = await inventoryService.getAllocationsByItem(req.params['id']);
    res.json({ success: true, data: allocs });
}));
router.post('/', asyncHandler(async (req, res) => {
    const data = inventorySchema.parse(req.body);
    const item = await inventoryService.create(data);
    res.json({ success: true, data: item });
}));
router.put('/:id', asyncHandler(async (req, res) => {
    const data = inventorySchema.partial().parse(req.body);
    const item = await inventoryService.update(req.params.id, data);
    res.json({ success: true, data: item });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        await inventoryService.delete(req.params.id);
        res.json({ success: true, data: null });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}));
export default router;
//# sourceMappingURL=inventory.js.map