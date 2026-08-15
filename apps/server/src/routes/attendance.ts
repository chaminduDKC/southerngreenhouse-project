import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { attendanceService } from '../services/attendanceService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate);

const attendanceSchema = z.object({
  workerId: z.string(),
  date: z.string().datetime(),
  present: z.boolean(),
  dailyPaid: z.number().optional()
});

const bulkAttendanceSchema = z.object({
  date: z.string(),
  records: z.array(z.object({
    workerId: z.string(),
    present: z.boolean(),
    dailyPaid: z.number().optional()
  }))
});

router.get('/', asyncHandler(async (req, res) => {
  const filters = {
    workerId: req.query.workerId as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    date: req.query.date as string
  };
  const attendances = await attendanceService.getAll(filters);
  res.json({ success: true, data: attendances });
}));

router.post('/', asyncHandler(async (req, res) => {
  const data = attendanceSchema.parse(req.body);
  const a = await attendanceService.create(data);
  res.json({ success: true, data: a });
}));

router.post('/bulk', asyncHandler(async (req, res) => {
  console.log(req.body)
  
  const data = bulkAttendanceSchema.parse(req.body);
  
  const a = await attendanceService.bulkUpsert(data);
  res.json({ success: true, data: a });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const data = attendanceSchema.partial().parse(req.body);
  const a = await attendanceService.update(req.params.id, data);
  res.json({ success: true, data: a });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await attendanceService.delete(req.params.id);
  res.json({ success: true, data: null });
}));

export default router;
