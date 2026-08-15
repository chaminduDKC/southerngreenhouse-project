import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { projectService } from '../services/projectService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ProjectStatus, TargetType } from '@prisma/client';
import { DivisionMethod } from '@sg/types';

// ── Schemas ──────────────────────────────────────────────────────────
const projectSchema = z.object({
  clientId: z.string(),
  title: z.string(),
  location: z.string(),
  status: z.nativeEnum(ProjectStatus).optional(),
  notes: z.string().optional(),
  value: z.number().optional(),
  divisionMethod: z.nativeEnum(DivisionMethod).optional(),
});

const numericString = z.union([z.number(), z.string()]).transform(val => {
  const n = typeof val === 'string' ? parseFloat(val) : val
  if (Number.isNaN(n)) throw new Error('Invalid number')
  return n
})

const subProjectSchema = z.object({
  projectId: z.string(),
  title: z.string(),
  location: z.string(),
  status: z.nativeEnum(ProjectStatus).optional(),
  notes: z.string().nullable().optional(),
  value: numericString.optional(),
})

const childProjectSchema = z.object({
  subProjectId: z.string(),
  title: z.string(),
  location: z.string(),
  status: z.nativeEnum(ProjectStatus).optional(),
  notes: z.string().optional(),
  value: z.number().optional(),
});

// ── Project Router (/api/projects) ───────────────────────────────────
const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (_req, res) => {
  const projects = await projectService.getAll();
  res.json({ success: true, data: projects });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const p = await projectService.getById(req.params['id']!);
  res.json({ success: true, data: p });
}));

router.post('/', asyncHandler(async (req, res) => {
  const data = projectSchema.parse(req.body);
  const p = await projectService.create(data as any);
  res.json({ success: true, data: p });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const data = projectSchema.partial().omit({ clientId: true }).parse(req.body);
  const p = await projectService.update(req.params['id']!, data as any);
  res.json({ success: true, data: p });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await projectService.delete(req.params['id']!);
  res.json({ success: true, data: null });
}));

router.get('/:id/allocations', asyncHandler(async (req, res) => {
  const allocs = await projectService.getAllocations(TargetType.PROJECT, req.params['id']!);
  res.json({ success: true, data: allocs });
}));

router.post('/:id/mark-used', asyncHandler(async (req, res) => {
  await projectService.markUsed(TargetType.PROJECT, req.params['id']!);
  res.json({ success: true, data: null });
}));

export default router;

// ── SubProject Router (/api/subprojects) ─────────────────────────────
const subRouter = Router();
subRouter.use(authenticate);

subRouter.get('/:id', asyncHandler(async (req, res) => {
  const s = await projectService.getSubById(req.params['id']!);
  res.json({ success: true, data: s });
}));

subRouter.post('/', asyncHandler(async (req, res) => {
  const data = subProjectSchema.parse(req.body);
  const s = await projectService.createSub(data as any);
  res.json({ success: true, data: s });
}));

subRouter.put('/:id', asyncHandler(async (req, res) => {
 
  const data = subProjectSchema.partial().omit({ projectId: true }).parse(req.body);
  const s = await projectService.updateSub(req.params['id']!, data as any);
  res.json({ success: true, data: s });
}));

subRouter.delete('/:id', asyncHandler(async (req, res) => {
  await projectService.deleteSub(req.params['id']!);
  res.json({ success: true, data: null });
}));

subRouter.get('/:id/allocations', asyncHandler(async (req, res) => {
  const allocs = await projectService.getAllocations(TargetType.SUB_PROJECT, req.params['id']!);
  res.json({ success: true, data: allocs });
}));

subRouter.post('/:id/mark-used', asyncHandler(async (req, res) => {
  await projectService.markUsed(TargetType.SUB_PROJECT, req.params['id']!);
  res.json({ success: true, data: null });
}));

export { subRouter };

// ── ChildProject Router (/api/childprojects) ─────────────────────────
const childRouter = Router();
childRouter.use(authenticate);

childRouter.get('/:id', asyncHandler(async (req, res) => {
  const c = await projectService.getChildById(req.params['id']!);
  res.json({ success: true, data: c });
}));

childRouter.post('/', asyncHandler(async (req, res) => {
  const data = childProjectSchema.parse(req.body);
  const c = await projectService.createChild(data as any);
  res.json({ success: true, data: c });
}));

childRouter.put('/:id', asyncHandler(async (req, res) => {
  const data = childProjectSchema.partial().omit({ subProjectId: true }).parse(req.body);
  const c = await projectService.updateChild(req.params['id']!, data as any);
  res.json({ success: true, data: c });
}));

childRouter.delete('/:id', asyncHandler(async (req, res) => {
  await projectService.deleteChild(req.params['id']!);
  res.json({ success: true, data: null });
}));

childRouter.get('/:id/allocations', asyncHandler(async (req, res) => {
  const allocs = await projectService.getAllocations(TargetType.CHILD_PROJECT, req.params['id']!);
  res.json({ success: true, data: allocs });
}));

childRouter.post('/:id/mark-used', asyncHandler(async (req, res) => {
  await projectService.markUsed(TargetType.CHILD_PROJECT, req.params['id']!);
  res.json({ success: true, data: null });
}));

export { childRouter };
