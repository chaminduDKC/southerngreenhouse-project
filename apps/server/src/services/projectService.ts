import { Prisma, TargetType, AllocationStatus, PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { CreateProjectDTO, UpdateProjectDTO, CreateSubProjectDTO, UpdateSubProjectDTO, CreateChildProjectDTO, UpdateChildProjectDTO } from '@sg/types';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AppError } from 'src/utils/AppError.js';

type TxClient = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

export const projectService = {
  async getAll() {
    return prisma.project.findMany({
      include: {
        client: true,
        _count: { select: { subProjects: true } },
        subProjects: {
          include: {
            _count: { select: { children: true } },
            children: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async syncValueUpwards(projectId: string, tx: any) {
    const project = await tx.project.findUnique({
      where: { id: projectId },
      include: { subProjects: { include: { children: true } } }
    });
    if (!project) return;
    
    let mainTotal = new Prisma.Decimal(0);
    for (const sub of project.subProjects) {
      if (sub.children.length > 0) {
        let subTotal = new Prisma.Decimal(0);
        for (const child of sub.children) {
          subTotal = subTotal.add(child.value);
        }
        await tx.subProject.update({ where: { id: sub.id }, data: { value: subTotal } });
        mainTotal = mainTotal.add(subTotal);
      } else {
        mainTotal = mainTotal.add(sub.value);
      }
    }
    
    if (project.subProjects.length > 0) {
      await tx.project.update({ where: { id: project.id }, data: { value: mainTotal } });
    }
  },

  async syncValueDownwards(projectId: string, newValue: number, method: 'EQUAL' | 'PROPORTIONAL', tx: any): Promise<void> {
    const project = await tx.project.findUnique({
      where: { id: projectId },
      include: { subProjects: { include: { children: true } } }
    });
    if (!project || project.subProjects.length === 0) return;
    
    const newTotal = new Prisma.Decimal(newValue);
    
    if (method === 'EQUAL') {
      const numSubs = project.subProjects.length;
      const valPerSub = newTotal.dividedBy(numSubs);
      for (const sub of project.subProjects) {
        await tx.subProject.update({ where: { id: sub.id }, data: { value: valPerSub } });
        if (sub.children.length > 0) {
          const valPerChild = valPerSub.dividedBy(sub.children.length);
          await tx.childProject.updateMany({ where: { subProjectId: sub.id }, data: { value: valPerChild } });
        }
      }
    } else {
      // PROPORTIONAL
      let oldMainTotal = new Prisma.Decimal(0);
      for (const sub of project.subProjects) {
        oldMainTotal = oldMainTotal.add(sub.value);
      }
      
      if (oldMainTotal.isZero()) {
        return this.syncValueDownwards(projectId, newValue, 'EQUAL', tx);
      }
      
      for (const sub of project.subProjects) {
        const subRatio = sub.value.dividedBy(oldMainTotal);
        const newSubVal = newTotal.mul(subRatio);
        await tx.subProject.update({ where: { id: sub.id }, data: { value: newSubVal } });
        
        if (sub.children.length > 0) {
          let oldSubTotal = new Prisma.Decimal(0);
          for (const child of sub.children) {
            oldSubTotal = oldSubTotal.add(child.value);
          }
          if (oldSubTotal.isZero()) {
             const valPerChild = newSubVal.dividedBy(sub.children.length);
             await tx.childProject.updateMany({ where: { subProjectId: sub.id }, data: { value: valPerChild } });
          } else {
             for (const child of sub.children) {
               const childRatio = child.value.dividedBy(oldSubTotal);
               const newChildVal = newSubVal.mul(childRatio);
               await tx.childProject.update({ where: { id: child.id }, data: { value: newChildVal } });
             }
          }
        }
      }
    }
  },

  async getById(id: string) {
    return prisma.project.findUniqueOrThrow({
      where: { id },
      include: {
        client: true,
        subProjects: { include: { children: true } }
      }
    });
  },

  async create(data: CreateProjectDTO) {
    return prisma.project.create({ data });
  },

  async update(id: string, data: UpdateProjectDTO) {
    const { divisionMethod, ...rest } = data;
    const project = await prisma.project.update({ where: { id }, data: rest as any });
    if (data.value !== undefined && divisionMethod) {
       await this.syncValueDownwards(id, data.value, divisionMethod, prisma);
    }
    return project;
  },

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id },
        include: { subProjects: { include: { children: true } } }
      });
      if (!project) return null;

      const subIds = project.subProjects.map(s => s.id);
      const childIds = project.subProjects.flatMap(s => s.children.map(c => c.id));
      const targetIds = [id, ...subIds, ...childIds];

      await tx.invoice.deleteMany({ where: { projectId: id } });
      await tx.quotation.deleteMany({ where: { projectId: id } });

      await tx.allocation.deleteMany({ where: { targetId: { in: targetIds } } });
      await tx.manualAllocation.deleteMany({ where: { targetId: { in: targetIds } } });
      await tx.ledgerCompletedProject.deleteMany({ where: { targetId: { in: targetIds } } });
      await tx.ledgerAllocatedProject.deleteMany({ where: { targetId: { in: targetIds } } });
      await tx.ledgerWorkerAdvance.deleteMany({ where: { targetId: { in: targetIds } } });

      return tx.project.delete({ where: { id } });
    });
  },

  async getSubById(id: string) {
    return prisma.subProject.findUniqueOrThrow({ where: { id }, include: { children: true } });
  },

  async createSub(data: CreateSubProjectDTO) {
    const sub = await prisma.subProject.create({ data });
    await this.syncValueUpwards(sub.projectId, prisma);
    return sub;
  },

  async updateSub(id: string, data: UpdateSubProjectDTO) {
    const sub = await prisma.subProject.update({ where: { id }, data });
    if (data.value !== undefined) {
      await this.syncValueUpwards(sub.projectId, prisma);
    }
    return sub;
  },

  async deleteSub(id: string) {
    return prisma.$transaction(async (tx) => {
      const sub = await tx.subProject.findUnique({
        where: { id },
        include: { children: true }
      });
      if (!sub) return null;

      const childIds = sub.children.map(c => c.id);
      const targetIds = [id, ...childIds];

      await tx.allocation.deleteMany({ where: { targetId: { in: targetIds } } });
      await tx.manualAllocation.deleteMany({ where: { targetId: { in: targetIds } } });
      await tx.ledgerCompletedProject.deleteMany({ where: { targetId: { in: targetIds } } });
      await tx.ledgerAllocatedProject.deleteMany({ where: { targetId: { in: targetIds } } });
      await tx.ledgerWorkerAdvance.deleteMany({ where: { targetId: { in: targetIds } } });

      const deletedSub = await tx.subProject.delete({ where: { id } });
      await this.syncValueUpwards(sub.projectId, tx);
      return deletedSub;
    });
  },

  async getChildById(id: string) {
    return prisma.childProject.findUniqueOrThrow({ where: { id } });
  },

  async createChild(data: CreateChildProjectDTO) {
    const child = await prisma.childProject.create({ data });
    const sub = await prisma.subProject.findUnique({ where: { id: child.subProjectId } });
    if (sub) await this.syncValueUpwards(sub.projectId, prisma);
    return child;
  },

  async updateChild(id: string, data: UpdateChildProjectDTO) {
    const child = await prisma.childProject.update({ where: { id }, data });
    if (data.value !== undefined) {
      const sub = await prisma.subProject.findUnique({ where: { id: child.subProjectId } });
      if (sub) await this.syncValueUpwards(sub.projectId, prisma);
    }
    return child;
  },

  async deleteChild(id: string) {
    return prisma.$transaction(async (tx) => {
      const child = await tx.childProject.findUnique({ where: { id } });
      if (!child) return null;

      await tx.allocation.deleteMany({ where: { targetId: id } });
      await tx.manualAllocation.deleteMany({ where: { targetId: id } });
      await tx.ledgerCompletedProject.deleteMany({ where: { targetId: id } });
      await tx.ledgerAllocatedProject.deleteMany({ where: { targetId: id } });
      await tx.ledgerWorkerAdvance.deleteMany({ where: { targetId: id } });

      const deletedChild = await tx.childProject.delete({ where: { id } });
      const sub = await tx.subProject.findUnique({ where: { id: child.subProjectId } });
      if (sub) await this.syncValueUpwards(sub.projectId, tx);
      return deletedChild;
    });
  },

  async getAllocations(targetType: TargetType, targetId: string) {
    return prisma.allocation.findMany({
      where: { targetType, targetId },
      include: { inventoryItem: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  async markUsed(targetType: TargetType, targetId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.allocation.updateMany({
        where: { targetType, targetId, status: AllocationStatus.ALLOCATED },
        data: { status: AllocationStatus.USED }
      });

      if (targetType === TargetType.PROJECT) {
        await tx.project.update({ where: { id: targetId }, data: { status: 'COMPLETED' } });
      } else if (targetType === TargetType.SUB_PROJECT) {
        await tx.subProject.update({ where: { id: targetId }, data: { status: 'COMPLETED' } });
      } else if (targetType === TargetType.CHILD_PROJECT) {
        await tx.childProject.update({ where: { id: targetId }, data: { status: 'COMPLETED' } });
      }
      
      await this.checkAndCascadeCompletion(targetType, targetId, tx);
      return { success: true };
    });
  },

  async checkAndCascadeCompletion(targetType: TargetType, targetId: string, tx: TxClient) {
    // 1. Cascade Down
    if (targetType === TargetType.PROJECT) {
      // Mark all subs and their children as completed
      const subs = await tx.subProject.findMany({ where: { projectId: targetId } });
      for (const sub of subs) {
        if (sub.status !== 'COMPLETED') {
          await tx.subProject.update({ where: { id: sub.id }, data: { status: 'COMPLETED' } });
        }
        await tx.childProject.updateMany({ where: { subProjectId: sub.id, status: { not: 'COMPLETED' } }, data: { status: 'COMPLETED' } });
      }
    } else if (targetType === TargetType.SUB_PROJECT) {
      // Mark all children as completed
      await tx.childProject.updateMany({ where: { subProjectId: targetId, status: { not: 'COMPLETED' } }, data: { status: 'COMPLETED' } });
    }

    // 2. Cascade Up
    if (targetType === TargetType.CHILD_PROJECT) {
      const child = await tx.childProject.findUnique({ where: { id: targetId } });
      if (!child) return;
      const siblings = await tx.childProject.findMany({ where: { subProjectId: child.subProjectId } });
      if (siblings.every(s => s.status === 'COMPLETED')) {
        const sub = await tx.subProject.findUnique({ where: { id: child.subProjectId } });
        if (sub && sub.status !== 'COMPLETED') {
          await tx.subProject.update({ where: { id: child.subProjectId }, data: { status: 'COMPLETED' } });
          await this.checkAndCascadeCompletion(TargetType.SUB_PROJECT, child.subProjectId, tx);
        }
      }
    } else if (targetType === TargetType.SUB_PROJECT) {
      const sub = await tx.subProject.findUnique({ where: { id: targetId } });
      if (!sub) return;
      const siblings = await tx.subProject.findMany({ where: { projectId: sub.projectId } });
      if (siblings.every(s => s.status === 'COMPLETED')) {
        const proj = await tx.project.findUnique({ where: { id: sub.projectId } });
        if (proj && proj.status !== 'COMPLETED') {
          await tx.project.update({ where: { id: sub.projectId }, data: { status: 'COMPLETED' } });
        }
      }
    }
  },

  // Reverse of checkAndCascadeCompletion — revert status to ACTIVE when a ledger record is deleted.
  // Cascade Down: mark the target and all its children ACTIVE.
  // Cascade Up: if parent was COMPLETED only because of this target, revert parent too.
  async revertCascadeCompletion(targetType: TargetType, targetId: string, tx: TxClient) {
    // 1. Revert target itself to ACTIVE
    if (targetType === TargetType.PROJECT) {
      await tx.project.update({ where: { id: targetId }, data: { status: 'ACTIVE' } });
      // Cascade down — revert all children too
      const subs = await tx.subProject.findMany({ where: { projectId: targetId } });
      for (const sub of subs) {
        await tx.subProject.update({ where: { id: sub.id }, data: { status: 'ACTIVE' } });
        await tx.childProject.updateMany({ where: { subProjectId: sub.id }, data: { status: 'ACTIVE' } });
      }
    } else if (targetType === TargetType.SUB_PROJECT) {
      await tx.subProject.update({ where: { id: targetId }, data: { status: 'ACTIVE' } });
      // Cascade down — revert all children
      await tx.childProject.updateMany({ where: { subProjectId: targetId }, data: { status: 'ACTIVE' } });
      // Cascade up — if parent project was completed, revert it too
      const sub = await tx.subProject.findUnique({ where: { id: targetId } });
      if (sub) {
        const parent = await tx.project.findUnique({ where: { id: sub.projectId } });
        if (parent && parent.status === 'COMPLETED') {
          await tx.project.update({ where: { id: sub.projectId }, data: { status: 'ACTIVE' } });
        }
      }
    } else if (targetType === TargetType.CHILD_PROJECT) {
      await tx.childProject.update({ where: { id: targetId }, data: { status: 'ACTIVE' } });
      // Cascade up — if parent sub was completed, revert it and possibly the main project too
      const child = await tx.childProject.findUnique({ where: { id: targetId } });
      if (child) {
        const parentSub = await tx.subProject.findUnique({ where: { id: child.subProjectId } });
        if (parentSub && parentSub.status === 'COMPLETED') {
          await tx.subProject.update({ where: { id: child.subProjectId }, data: { status: 'ACTIVE' } });
          const parentProject = await tx.project.findUnique({ where: { id: parentSub.projectId } });
          if (parentProject && parentProject.status === 'COMPLETED') {
            await tx.project.update({ where: { id: parentSub.projectId }, data: { status: 'ACTIVE' } });
          }
        }
      }
    }
  },


  async getRootProjectId(targetType: TargetType, targetId: string, tx: TxClient): Promise<string | null> {
    if (targetType === TargetType.PROJECT) return targetId;
    if (targetType === TargetType.SUB_PROJECT) {
      const sub = await tx.subProject.findUnique({ where: { id: targetId } });
      return sub ? sub.projectId : null;
    }
    if (targetType === TargetType.CHILD_PROJECT) {
      const child = await tx.childProject.findUnique({ where: { id: targetId }, include: { subProject: true } });
      return child ? child.subProject.projectId : null;
    }
    return null;
  },

  async resolveTargetName(targetType: TargetType, targetId: string, tx: TxClient): Promise<string> {
    if (targetType === TargetType.PROJECT) {
      const proj = await tx.project.findUnique({ where: { id: targetId } });
      return proj ? proj.title : 'Unknown Project';
    }
    if (targetType === TargetType.SUB_PROJECT) {
      const sub = await tx.subProject.findUnique({ where: { id: targetId }, include: { project: true } });
      return sub ? `${sub.project.title} -> ${sub.title}` : 'Unknown Sub-Project';
    }
    if (targetType === TargetType.CHILD_PROJECT) {
      const child = await tx.childProject.findUnique({ 
        where: { id: targetId }, 
        include: { subProject: { include: { project: true } } } 
      });
      return child ? `${child.subProject.project.title} -> ${child.subProject.title} -> ${child.title}` : 'Unknown Child-Project';
    }
    return 'Unknown';
  },

  async syncProjectCost(projectId: string, tx: TxClient) {
    // 1. Fetch the entire project hierarchy
    const project = await tx.project.findUnique({
      where: { id: projectId },
      include: {
        subProjects: {
          include: {
            children: true
          }
        }
      }
    });

    if (!project) return;

    let totalProjectCost = new Prisma.Decimal(0);

    // Compute costs for sub-projects
    for (const sub of project.subProjects) {
      let totalSubCost = new Prisma.Decimal(0);

      // Compute costs for child-projects
      for (const child of sub.children) {
        // Direct child cost = Ledger allocations + Inventory allocations
        const [ledgerChild, invChild] = await Promise.all([
          tx.ledgerAllocatedProject.aggregate({
            where: { targetType: TargetType.CHILD_PROJECT, targetId: child.id },
            _sum: { amount: true }
          }),
          tx.allocation.findMany({
            where: { targetType: TargetType.CHILD_PROJECT, targetId: child.id, status: { in: [AllocationStatus.ALLOCATED, AllocationStatus.USED] } },
            include: { inventoryItem: true }
          })
        ]);

        const ledgerCost = ledgerChild._sum.amount || new Prisma.Decimal(0);
        const invCost = invChild.reduce((acc, alloc) => acc.add(alloc.inventoryItem.soldPrice.mul(alloc.quantity)), new Prisma.Decimal(0));
        const childTotal = ledgerCost.add(invCost);

        if (!child.cost.equals(childTotal)) {
          await tx.childProject.update({ where: { id: child.id }, data: { cost: childTotal } });
        }

        totalSubCost = totalSubCost.add(childTotal);
      }

      // Direct sub cost = Ledger allocations + Inventory allocations
      const [ledgerSub, invSub] = await Promise.all([
        tx.ledgerAllocatedProject.aggregate({
          where: { targetType: TargetType.SUB_PROJECT, targetId: sub.id },
          _sum: { amount: true }
        }),
        tx.allocation.findMany({
          where: { targetType: TargetType.SUB_PROJECT, targetId: sub.id, status: { in: [AllocationStatus.ALLOCATED, AllocationStatus.USED] } },
          include: { inventoryItem: true }
        })
      ]);

      const ledgerCostSub = ledgerSub._sum.amount || new Prisma.Decimal(0);
      const invCostSub = invSub.reduce((acc, alloc) => acc.add(alloc.inventoryItem.soldPrice.mul(alloc.quantity)), new Prisma.Decimal(0));
      const subTotal = totalSubCost.add(ledgerCostSub).add(invCostSub);

      if (!sub.cost.equals(subTotal)) {
        await tx.subProject.update({ where: { id: sub.id }, data: { cost: subTotal } });
      }

      totalProjectCost = totalProjectCost.add(subTotal);
    }

    // Direct project cost = Ledger allocations + Inventory allocations
    const [ledgerProj, invProj] = await Promise.all([
      tx.ledgerAllocatedProject.aggregate({
        where: { targetType: TargetType.PROJECT, targetId: projectId },
        _sum: { amount: true }
      }),
      tx.allocation.findMany({
        where: { targetType: TargetType.PROJECT, targetId: projectId, status: { in: [AllocationStatus.ALLOCATED, AllocationStatus.USED] } },
        include: { inventoryItem: true }
      })
    ]);

    const ledgerCostProj = ledgerProj._sum.amount || new Prisma.Decimal(0);
    const invCostProj = invProj.reduce((acc, alloc) => acc.add(alloc.inventoryItem.soldPrice.mul(alloc.quantity)), new Prisma.Decimal(0));
    const projectTotal = totalProjectCost.add(ledgerCostProj).add(invCostProj);

    if (!project.cost.equals(projectTotal)) {
      await tx.project.update({ where: { id: project.id }, data: { cost: projectTotal } });
    }
  }
};