import { Router } from 'express';
import { z } from 'zod';
import React from 'react';
import { authenticate } from '../middleware/auth.js';
import { invoiceService } from '../services/invoiceService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { streamPDF } from '../pdf/renderPDF.js';
import InvoicePDF from '../pdf/InvoicePDF.js';
const router = Router();
router.use(authenticate);
const invoiceSchema = z.object({
    clientId: z.string(),
    projectId: z.string(),
    quotationId: z.string().optional(),
    totalAmount: z.number().nonnegative(),
    amountDue: z.number().nonnegative(),
    dueDate: z.string(),
    notes: z.string().optional()
});
router.get('/', asyncHandler(async (req, res) => {
    const invs = await invoiceService.getAll();
    res.json({ success: true, data: invs });
}));
router.get('/:id', asyncHandler(async (req, res) => {
    const inv = await invoiceService.getById(req.params.id);
    res.json({ success: true, data: inv });
}));
router.post('/', asyncHandler(async (req, res) => {
    const data = invoiceSchema.parse(req.body);
    const inv = await invoiceService.create(data);
    res.json({ success: true, data: inv });
}));
router.put('/:id', asyncHandler(async (req, res) => {
    const data = invoiceSchema.partial().parse(req.body);
    const inv = await invoiceService.update(req.params.id, data);
    res.json({ success: true, data: inv });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
    await invoiceService.delete(req.params.id);
    res.json({ success: true, data: null });
}));
router.get('/:id/pdf', asyncHandler(async (req, res) => {
    const inv = await invoiceService.getById(req.params.id);
    const doc = React.createElement(InvoicePDF, { invoice: inv });
    await streamPDF(doc, res, `Invoice_${inv.id}`);
}));
export default router;
//# sourceMappingURL=invoices.js.map