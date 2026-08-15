import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { manualAllocationService } from "../services/manualAllocationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { TargetType } from "@prisma/client";
const router = Router();
router.use(authenticate);
const createSchema = z.object({
    targetType: z.nativeEnum(TargetType),
    targetId: z.string(),
    itemName: z.string().min(1),
    unit: z.string().min(1),
    quantity: z.number().positive(),
    notes: z.string().optional()
});
const updateSchema = z.object({
    itemName: z.string().min(1).optional(),
    unit: z.string().min(1).optional(),
    quantity: z.number().positive().optional(),
    notes: z.string().optional()
});
// GET /manual-allocations?targetType=&targetId= -> direct items
// GET /manual-allocations?targetType=PROJECT&targetId=&aggregated=true -> aggregated tree
router.get("/", asyncHandler(async (req, res) => {
    const { targetType, targetId, aggregated } = req.query;
    if (!targetType || !targetId)
        return res.status(400).json({ success: false, error: "targetType and targetId required" });
    if (aggregated === "true") {
        if (targetType === TargetType.PROJECT) {
            const data = await manualAllocationService.getAggregatedForProject(targetId);
            return res.json({ success: true, data });
        }
        else if (targetType === TargetType.SUB_PROJECT) {
            const data = await manualAllocationService.getAggregatedForSub(targetId);
            return res.json({ success: true, data });
        }
        // CHILD_PROJECT has no children, fall through to direct
    }
    const data = await manualAllocationService.getForTarget(targetType, targetId);
    res.json({ success: true, data });
}));
router.post("/", asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    const item = await manualAllocationService.create(data);
    res.json({ success: true, data: item });
}));
router.put("/:id", asyncHandler(async (req, res) => {
    const data = updateSchema.parse(req.body);
    const item = await manualAllocationService.update(req.params["id"], data);
    res.json({ success: true, data: item });
}));
router.delete("/:id", asyncHandler(async (req, res) => {
    await manualAllocationService.delete(req.params["id"]);
    res.json({ success: true, data: null });
}));
export default router;
//# sourceMappingURL=manualAllocations.js.map