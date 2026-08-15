import { Prisma, TargetType, AllocationStatus } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { CreateInventoryItemDTO, UpdateInventoryItemDTO, CreateAllocationDTO } from '@sg/types';
import { Decimal } from '@prisma/client/runtime/library';
import { projectService } from './projectService.js';

export const inventoryService = {
  async getAll(search?: string) {
    const where: Prisma.InventoryItemWhereInput = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};
    
    const items = await prisma.inventoryItem.findMany({ where, orderBy: { name: 'asc' } });
    return items.map(item => ({
      ...item,
      unitSize: item.unitSize.toNumber(),
      boughtPrice: item.boughtPrice.toNumber(),
      soldPrice: item.soldPrice.toNumber(),
      quantity: item.quantity.toNumber(),
      lowStockThreshold: item.lowStockThreshold.toNumber(),
      isLowStock: item.quantity.lessThanOrEqualTo(item.lowStockThreshold)
    }));
  },

  async getById(id: string) {
    const item = await prisma.inventoryItem.findUniqueOrThrow({ where: { id } });
    return {
      ...item,
      unitSize: item.unitSize.toNumber(),
      boughtPrice: item.boughtPrice.toNumber(),
      soldPrice: item.soldPrice.toNumber(),
      quantity: item.quantity.toNumber(),
      lowStockThreshold: item.lowStockThreshold.toNumber(),
    };
  },

  async create(data: CreateInventoryItemDTO) {
    const item = await prisma.inventoryItem.create({ data });
    return this.getById(item.id);
  },

  async update(id: string, data: UpdateInventoryItemDTO) {
    const item = await prisma.inventoryItem.update({ where: { id }, data });
    return this.getById(item.id);
  },

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      await tx.allocation.deleteMany({ where: { inventoryItemId: id } });
      await tx.quotationItem.updateMany({
        where: { inventoryItemId: id },
        data: { inventoryItemId: null }
      });
      return tx.inventoryItem.delete({ where: { id } });
    });
  },

  async getEligibleTargets() {
    const projects = await prisma.project.findMany({
      include: { subProjects: { include: { children: true } } }
    });

    const targets: { id: string; title: string; targetType: TargetType; location: string; status: string }[] = [];

    for (const proj of projects) {
      if (proj.subProjects.length === 0) {
        targets.push({ id: proj.id, title: proj.title, targetType: TargetType.PROJECT, location: proj.location, status: proj.status });
      } else {
        for (const sub of proj.subProjects) {
          if (sub.children.length === 0) {
            targets.push({ id: sub.id, title: `${proj.title} > ${sub.title}`, targetType: TargetType.SUB_PROJECT, location: sub.location, status: sub.status });
          } else {
            for (const child of sub.children) {
              targets.push({ id: child.id, title: `${proj.title} > ${sub.title} > ${child.title}`, targetType: TargetType.CHILD_PROJECT, location: child.location, status: child.status });
            }
          }
        }
      }
    }
    return targets;
  },

  async allocate(data: CreateAllocationDTO) {
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUniqueOrThrow({ where: { id: data.inventoryItemId } });
      const allocations = [];

      for (const row of data.rows) {
        const qty = new Prisma.Decimal(row.quantity);
        
        const allocation = await tx.allocation.create({
          data: {
            inventoryItemId: item.id,
            targetType: row.targetType,
            targetId: row.targetId,
            quantity: qty
          }
        });
        allocations.push(allocation);

        await tx.inventoryItem.update({
          where: { id: item.id },
          data: { quantity: { decrement: qty } }
        });

        const costToAdd = item.soldPrice.mul(qty);
        
        // Remove manual increment
        // if (row.targetType === TargetType.PROJECT) { ... }
      }

      // Sync all affected root projects
      const affectedRootProjects = new Set<string>();
      for (const row of data.rows) {
        const rootId = await projectService.getRootProjectId(row.targetType, row.targetId, tx as any);
        if (rootId) affectedRootProjects.add(rootId);
      }

      return { allocations, affectedRootProjects: Array.from(affectedRootProjects) };
    });

    for (const rootId of result.affectedRootProjects) {
      await projectService.syncProjectCost(rootId, prisma as any);
    }

    return result.allocations;
  },

  async getAllocationsByItem(itemId: string) {
    const allocations = await prisma.allocation.findMany({
      where: { inventoryItemId: itemId },
      include: { inventoryItem: true },
      orderBy: { createdAt: 'desc' }
    });

    const results = [];
    for (const a of allocations) {
      let targetTitle = a.targetId;
      try {
        if (a.targetType === TargetType.PROJECT) {
          const p = await prisma.project.findUnique({ where: { id: a.targetId } });
          targetTitle = p?.title ?? a.targetId;
        } else if (a.targetType === TargetType.SUB_PROJECT) {
          const s = await prisma.subProject.findUnique({ where: { id: a.targetId }, include: { project: true } });
          targetTitle = s ? `${s.project.title} > ${s.title}` : a.targetId;
        } else if (a.targetType === TargetType.CHILD_PROJECT) {
          const c = await prisma.childProject.findUnique({ where: { id: a.targetId }, include: { subProject: { include: { project: true } } } });
          targetTitle = c ? `${c.subProject.project.title} > ${c.subProject.title} > ${c.title}` : a.targetId;
        }
      } catch { /* ignore */ }
      results.push({
        id: a.id,
        inventoryItemId: a.inventoryItemId,
        inventoryItem: { name: a.inventoryItem.name, unit: a.inventoryItem.unit },
        targetType: a.targetType,
        targetId: a.targetId,
        targetTitle,
        quantity: a.quantity.toNumber(),
        status: a.status,
        createdAt: a.createdAt.toISOString(),
      });
    }
    return results;
  }
};
