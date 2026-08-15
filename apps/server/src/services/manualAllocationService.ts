import { TargetType } from "@prisma/client";
import prisma from "../lib/prisma.js";

async function resolveTargetTitle(targetType: TargetType, targetId: string) {
  try {
    if (targetType === TargetType.PROJECT) {
      const p = await prisma.project.findUnique({ where: { id: targetId } });
      return p?.title ?? targetId;
    } else if (targetType === TargetType.SUB_PROJECT) {
      const s = await prisma.subProject.findUnique({ 
        where: { id: targetId },
        include: { project: true }
      });
      if (s) return `${s.project.title} -> ${s.title}`;
      return targetId;
    } else {
      const c = await prisma.childProject.findUnique({ 
        where: { id: targetId },
        include: { subProject: { include: { project: true } } }
      });
      if (c) return `${c.subProject.project.title} -> ${c.subProject.title} -> ${c.title}`;
      return targetId;
    }
  } catch { return targetId; }
}

async function aggregate(items: any[]) {
  const map = new Map();
  for (const item of items) {
    const key = `${item.itemName.toLowerCase().trim()}||${item.unit.toLowerCase().trim()}`;
    const targetTitle = await resolveTargetTitle(item.targetType, item.targetId);
    if (!map.has(key)) map.set(key, { itemName: item.itemName, unit: item.unit, totalQuantity: 0, breakdown: [] });
    const entry = map.get(key);
    const qty = typeof item.quantity?.toNumber === "function" ? item.quantity.toNumber() : Number(item.quantity);
    entry.totalQuantity += qty;
    entry.breakdown.push({ id: item.id, targetType: item.targetType, targetId: item.targetId, targetTitle, quantity: qty, notes: item.notes });
  }
  return Array.from(map.values()).sort((a, b) => a.itemName.localeCompare(b.itemName));
}

export const manualAllocationService = {
  async getForTarget(targetType: TargetType, targetId: string) {
    const items = await prisma.manualAllocation.findMany({ where: { targetType, targetId }, orderBy: { createdAt: "desc" } });
    return Promise.all(items.map(async i => ({
      id: i.id, targetType: i.targetType, targetId: i.targetId,
      targetTitle: await resolveTargetTitle(i.targetType, i.targetId),
      itemName: i.itemName, unit: i.unit, quantity: i.quantity.toNumber(), notes: i.notes, createdAt: i.createdAt.toISOString()
    })));
  },

  async getAggregatedForProject(projectId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId }, include: { subProjects: { include: { children: true } } } });
    if (!project) return [];
    const queries: { targetType: TargetType; targetId: string }[] = [{ targetType: TargetType.PROJECT, targetId: projectId }];
    for (const sub of project.subProjects) {
      queries.push({ targetType: TargetType.SUB_PROJECT, targetId: sub.id });
      for (const child of sub.children) queries.push({ targetType: TargetType.CHILD_PROJECT, targetId: child.id });
    }
    const allItems = await prisma.manualAllocation.findMany({ where: { OR: queries }, orderBy: { itemName: "asc" } });
    return aggregate(allItems);
  },

  async getAggregatedForSub(subProjectId: string) {
    const sub = await prisma.subProject.findUnique({ where: { id: subProjectId }, include: { children: true } });
    if (!sub) return [];
    const queries: { targetType: TargetType; targetId: string }[] = [{ targetType: TargetType.SUB_PROJECT, targetId: subProjectId }];
    for (const child of sub.children) queries.push({ targetType: TargetType.CHILD_PROJECT, targetId: child.id });
    const allItems = await prisma.manualAllocation.findMany({ where: { OR: queries }, orderBy: { itemName: "asc" } });
    return aggregate(allItems);
  },

  async create(data: any) {
    const item = await prisma.manualAllocation.create({ data: { targetType: data.targetType, targetId: data.targetId, itemName: data.itemName, unit: data.unit, quantity: data.quantity, notes: data.notes ?? "" } });
    return { ...item, quantity: item.quantity.toNumber() };
  },

  async update(id: string, data: any) {
    const item = await prisma.manualAllocation.update({ where: { id }, data: { ...(data.itemName !== undefined && { itemName: data.itemName }), ...(data.unit !== undefined && { unit: data.unit }), ...(data.quantity !== undefined && { quantity: data.quantity }), ...(data.notes !== undefined && { notes: data.notes }) } });
    return { ...item, quantity: item.quantity.toNumber() };
  },

  async delete(id: string) {
    await prisma.manualAllocation.delete({ where: { id } });
  }
};
