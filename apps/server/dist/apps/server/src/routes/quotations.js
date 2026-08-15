import { Router } from 'express';
import { z } from 'zod';
import React from 'react';
import { authenticate } from '../middleware/auth.js';
import { quotationService } from '../services/quotationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { streamPDF } from '../pdf/renderPDF.js';
import QuotationPDF from '../pdf/QuotationPDF.js';
import { QuotationStatus } from '@prisma/client';
const router = Router();
router.use(authenticate);
const quotationSchema = z.object({
    clientId: z.string(),
    projectId: z.string().optional(),
    validUntil: z.string().datetime(),
    transportCost: z.number().optional(),
    notes: z.string().optional(),
    status: z.nativeEnum(QuotationStatus).optional(),
    items: z.array(z.object({
        inventoryItemId: z.string().optional(),
        description: z.string(),
        qty: z.number().positive(),
        unitPrice: z.number().nonnegative()
    }))
});
router.get('/', asyncHandler(async (req, res) => {
    const qs = await quotationService.getAll();
    res.json({ success: true, data: qs });
}));
router.get('/:id', asyncHandler(async (req, res) => {
    const q = await quotationService.getById(req.params['id']);
    res.json({ success: true, data: q });
}));
router.post('/', asyncHandler(async (req, res) => {
    const data = quotationSchema.parse(req.body);
    const q = await quotationService.create(data);
    res.json({ success: true, data: q });
}));
router.put('/:id', asyncHandler(async (req, res) => {
    const data = quotationSchema.partial().parse(req.body);
    const q = await quotationService.update(req.params['id'], data);
    res.json({ success: true, data: q });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
    await quotationService.delete(req.params['id']);
    res.json({ success: true, data: null });
}));
router.get('/:id/pdf', asyncHandler(async (req, res) => {
    const q = await quotationService.getById(req.params['id']);
    const doc = React.createElement(QuotationPDF, { quotation: q });
    await streamPDF(doc, res, `Quotation_${q.id}`);
}));
export default router;
//# sourceMappingURL=quotations.js.map