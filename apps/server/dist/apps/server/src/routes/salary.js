import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { salaryService } from '../services/salaryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { streamPDF } from '../pdf/renderPDF.js';
import PaysheetPDF from '../pdf/PaysheetPDF.js';
import React from 'react';
const router = Router();
router.use(authenticate);
const calcSchema = z.object({
    workerId: z.string(),
    month: z.number().min(1).max(12),
    year: z.number().min(2000)
});
const saveSchema = calcSchema.extend({
    daysWorked: z.number().nonnegative(),
    basePay: z.number().nonnegative(),
    bonuses: z.number().nonnegative(),
    deductions: z.number().nonnegative(),
    advancesTotal: z.number().nonnegative(),
    netPay: z.number()
});
router.get('/', asyncHandler(async (req, res) => {
    const salaries = await salaryService.getAll();
    res.json({ success: true, data: salaries });
}));
router.get('/:id', asyncHandler(async (req, res) => {
    const salary = await salaryService.getById(req.params['id']);
    res.json({ success: true, data: salary });
}));
router.post('/calculate', asyncHandler(async (req, res) => {
    const data = calcSchema.parse(req.body);
    const result = await salaryService.calculate(data);
    res.json({ success: true, data: result });
}));
router.post('/', asyncHandler(async (req, res) => {
    const data = saveSchema.parse(req.body);
    const salary = await salaryService.save(data);
    res.json({ success: true, data: salary });
}));
router.put('/:id', asyncHandler(async (req, res) => {
    const data = saveSchema.pick({ bonuses: true, deductions: true, netPay: true }).partial().parse(req.body);
    const salary = await salaryService.update(req.params['id'], data);
    res.json({ success: true, data: salary });
}));
router.get('/:id/pdf', asyncHandler(async (req, res) => {
    const salary = await salaryService.getById(req.params['id']);
    const doc = React.createElement(PaysheetPDF, { salary });
    await streamPDF(doc, res, `Paysheet_${salary.worker.workerId}_${salary.month}_${salary.year}`);
}));
export default router;
//# sourceMappingURL=salary.js.map