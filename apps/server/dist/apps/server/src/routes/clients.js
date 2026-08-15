import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { clientService } from '../services/clientService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router();
router.use(authenticate);
const clientSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    address: z.string()
});
router.get('/', asyncHandler(async (req, res) => {
    const search = req.query.search;
    const clients = await clientService.getAll(search);
    res.json({ success: true, data: clients });
}));
router.get('/:id', asyncHandler(async (req, res) => {
    const client = await clientService.getById(req.params.id);
    res.json({ success: true, data: client });
}));
router.post('/', asyncHandler(async (req, res) => {
    const data = clientSchema.parse(req.body);
    const client = await clientService.create(data);
    res.json({ success: true, data: client });
}));
router.put('/:id', asyncHandler(async (req, res) => {
    const data = clientSchema.partial().parse(req.body);
    const client = await clientService.update(req.params.id, data);
    res.json({ success: true, data: client });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
    await clientService.softDelete(req.params.id);
    res.json({ success: true, data: null });
}));
export default router;
//# sourceMappingURL=clients.js.map