import { Prisma, TargetType } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { projectService } from './projectService.js';
import { salaryService } from './salaryService.js';
async function calculateAllocations(cost, targets, tx) {
    if (targets.length === 0)
        return [];
    // 1. Resolve all targets to their full lineage
    const resolvedTargets = await Promise.all(targets.map(async (t) => {
        if (t.targetType === TargetType.PROJECT) {
            return { ...t, projectId: t.targetId, subProjectId: null, childProjectId: null };
        }
        else if (t.targetType === TargetType.SUB_PROJECT) {
            const sub = await tx.subProject.findUnique({ where: { id: t.targetId } });
            return { ...t, projectId: sub.projectId, subProjectId: t.targetId, childProjectId: null };
        }
        else {
            const child = await tx.childProject.findUnique({ where: { id: t.targetId }, include: { subProject: true } });
            return { ...t, projectId: child.subProject.projectId, subProjectId: child.subProjectId, childProjectId: t.targetId };
        }
    }));
    // 2. Group by Root Project
    const rootGroups = new Map();
    for (const rt of resolvedTargets) {
        if (!rootGroups.has(rt.projectId))
            rootGroups.set(rt.projectId, []);
        rootGroups.get(rt.projectId).push(rt);
    }
    const numRoots = rootGroups.size;
    const rootShare = cost.dividedBy(numRoots);
    const finalAllocations = [];
    for (const [projectId, items] of rootGroups.entries()) {
        // 3. For each root group, find selected SubProjects
        const selectedSubs = new Set();
        for (const item of items) {
            if (item.subProjectId)
                selectedSubs.add(item.subProjectId);
        }
        if (selectedSubs.size === 0) {
            finalAllocations.push({ targetType: TargetType.PROJECT, targetId: projectId, amount: rootShare });
        }
        else {
            const subShare = rootShare.dividedBy(selectedSubs.size);
            const subGroups = new Map();
            for (const item of items) {
                if (item.subProjectId) {
                    if (!subGroups.has(item.subProjectId))
                        subGroups.set(item.subProjectId, []);
                    subGroups.get(item.subProjectId).push(item);
                }
            }
            for (const [subId, subItems] of subGroups.entries()) {
                const selectedChilds = new Set();
                for (const item of subItems) {
                    if (item.childProjectId)
                        selectedChilds.add(item.childProjectId);
                }
                if (selectedChilds.size === 0) {
                    finalAllocations.push({ targetType: TargetType.SUB_PROJECT, targetId: subId, amount: subShare });
                }
                else {
                    const childShare = subShare.dividedBy(selectedChilds.size);
                    for (const childId of selectedChilds) {
                        finalAllocations.push({ targetType: TargetType.CHILD_PROJECT, targetId: childId, amount: childShare });
                    }
                }
            }
        }
    }
    return finalAllocations.map(a => ({
        ...a,
        amount: a.amount.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
    }));
}
export const ledgerService = {
    async getAll(page, pageSize) {
        const skip = (page - 1) * pageSize;
        const [entries, total] = await Promise.all([
            prisma.ledgerEntry.findMany({
                skip,
                take: pageSize,
                orderBy: { date: 'desc' },
                include: {
                    workerAdvances: { include: { worker: true } },
                    completedProjects: true,
                    allocatedProjects: true
                }
            }),
            prisma.ledgerEntry.count()
        ]);
        const latestDate = await prisma.ledgerEntry.aggregate({
            _max: { date: true }
        });
        const maxDate = latestDate._max.date?.getTime();
        const data = await Promise.all(entries.map(async (e) => ({
            id: e.id,
            date: e.date.toISOString(),
            openingBalance: e.openingBalance.toNumber(),
            paymentGivenToday: e.paymentGivenToday.toNumber(),
            balanceReturnedToday: e.balanceReturnedToday.toNumber(),
            cost: e.cost.toNumber(),
            workerAdvances: await Promise.all(e.workerAdvances.map(async (wa) => ({
                workerId: wa.workerId,
                workerName: wa.worker.name,
                advanceAmount: wa.advanceAmount.toNumber(),
                targetType: wa.targetType || undefined,
                targetId: wa.targetId || undefined,
                targetTitle: (wa.targetType && wa.targetId) ? await projectService.resolveTargetName(wa.targetType, wa.targetId, prisma) : undefined
            }))),
            completedProjects: await Promise.all(e.completedProjects.map(async (cp) => ({
                targetType: cp.targetType,
                targetId: cp.targetId,
                targetTitle: await projectService.resolveTargetName(cp.targetType, cp.targetId, prisma)
            }))),
            allocatedProjects: await Promise.all(e.allocatedProjects.map(async (ap) => ({
                targetType: ap.targetType,
                targetId: ap.targetId,
                targetTitle: await projectService.resolveTargetName(ap.targetType, ap.targetId, prisma),
                amount: ap.amount.toNumber()
            }))),
            isLatest: e.date.getTime() === maxDate,
            createdAt: e.createdAt.toISOString()
        })));
        return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    },
    async getById(id) {
        const e = await prisma.ledgerEntry.findUniqueOrThrow({
            where: { id },
            include: {
                workerAdvances: { include: { worker: true } },
                completedProjects: true,
                allocatedProjects: true
            }
        });
        return {
            ...e,
            workerAdvances: await Promise.all(e.workerAdvances.map(async (wa) => ({
                ...wa,
                targetTitle: (wa.targetType && wa.targetId) ? await projectService.resolveTargetName(wa.targetType, wa.targetId, prisma) : undefined
            }))),
            completedProjects: await Promise.all(e.completedProjects.map(async (cp) => ({
                ...cp,
                targetTitle: await projectService.resolveTargetName(cp.targetType, cp.targetId, prisma)
            }))),
            allocatedProjects: await Promise.all(e.allocatedProjects.map(async (ap) => ({
                ...ap,
                targetTitle: await projectService.resolveTargetName(ap.targetType, ap.targetId, prisma)
            })))
        };
    },
    async create(data) {
        const result = await prisma.$transaction(async (tx) => {
            const cost = new Prisma.Decimal(data.openingBalance).add(data.paymentGivenToday).sub(data.balanceReturnedToday);
            const computedAllocations = await calculateAllocations(cost, data.allocatedProjects || [], tx);
            const entryDate = new Date(data.date);
            const entry = await tx.ledgerEntry.create({
                data: {
                    date: entryDate,
                    openingBalance: data.openingBalance,
                    paymentGivenToday: data.paymentGivenToday,
                    balanceReturnedToday: data.balanceReturnedToday,
                    cost,
                    workerAdvances: {
                        create: data.workerAdvances.map(wa => ({
                            workerId: wa.workerId,
                            advanceAmount: wa.advanceAmount,
                            targetType: wa.targetType,
                            targetId: wa.targetId
                        }))
                    },
                    completedProjects: {
                        create: data.completedProjects.map(cp => ({
                            targetType: cp.targetType,
                            targetId: cp.targetId
                        }))
                    },
                    allocatedProjects: {
                        create: computedAllocations.map(ap => ({
                            targetType: ap.targetType,
                            targetId: ap.targetId,
                            amount: ap.amount
                        }))
                    }
                },
                include: { allocatedProjects: true }
            });
            // Gather affected root projects to sync AFTER transaction
            const affectedRootProjects = new Set();
            for (const ap of entry.allocatedProjects) {
                const rootId = await projectService.getRootProjectId(ap.targetType, ap.targetId, tx);
                if (rootId)
                    affectedRootProjects.add(rootId);
            }
            // Update Attendance for worker advances
            for (const wa of data.workerAdvances) {
                await tx.attendance.upsert({
                    where: { workerId_date: { workerId: wa.workerId, date: entryDate } },
                    update: { advanceGiven: wa.advanceAmount },
                    create: { workerId: wa.workerId, date: entryDate, present: true, advanceGiven: wa.advanceAmount }
                });
            }
            return { entry, affectedRootProjects: Array.from(affectedRootProjects), completedProjects: data.allocatedProjects };
        });
        // Mark projects completed OUTSIDE transaction to avoid timeouts
        for (const cp of result.completedProjects) {
            if (cp.targetType === TargetType.PROJECT) {
                await prisma.project.update({ where: { id: cp.targetId }, data: { status: 'COMPLETED' } });
            }
            else if (cp.targetType === TargetType.SUB_PROJECT) {
                await prisma.subProject.update({ where: { id: cp.targetId }, data: { status: 'COMPLETED' } });
            }
            else if (cp.targetType === TargetType.CHILD_PROJECT) {
                await prisma.childProject.update({ where: { id: cp.targetId }, data: { status: 'COMPLETED' } });
            }
            await projectService.checkAndCascadeCompletion(cp.targetType, cp.targetId, prisma);
        }
        // Sync project costs outside of transaction to prevent timeouts
        for (const rootId of result.affectedRootProjects) {
            await projectService.syncProjectCost(rootId, prisma);
        }
        // Sync salary for all workers involved in advances
        const entryDate = new Date(data.date);
        for (const wa of data.workerAdvances) {
            await salaryService.syncSalary(wa.workerId, entryDate);
        }
        return result.entry;
    },
    async update(id, data) {
        const entry = await prisma.ledgerEntry.findUnique({
            where: { id },
            include: { workerAdvances: true, allocatedProjects: true }
        });
        if (!entry)
            throw new Error('Not found');
        const latest = await prisma.ledgerEntry.aggregate({ _max: { date: true } });
        if (latest._max.date?.getTime() !== entry.date.getTime()) {
            throw new Error('Only the latest ledger entry can be modified or deleted');
        }
        const result = await prisma.$transaction(async (tx) => {
            // Revert old project cost allocations (will be handled by syncProjectCost later)
            const affectedRootProjects = new Set();
            for (const ap of entry.allocatedProjects) {
                const rootId = await projectService.getRootProjectId(ap.targetType, ap.targetId, tx);
                if (rootId)
                    affectedRootProjects.add(rootId);
            }
            // Revert old attendance advances (set to 0 for those workers on this date)
            for (const oldWa of entry.workerAdvances) {
                await tx.attendance.updateMany({
                    where: { workerId: oldWa.workerId, date: entry.date },
                    data: { advanceGiven: 0 }
                });
            }
            // Delete old nested relations
            await tx.ledgerWorkerAdvance.deleteMany({ where: { ledgerEntryId: id } });
            await tx.ledgerCompletedProject.deleteMany({ where: { ledgerEntryId: id } });
            await tx.ledgerAllocatedProject.deleteMany({ where: { ledgerEntryId: id } });
            const cost = new Prisma.Decimal(data.openingBalance ?? entry.openingBalance.toNumber())
                .add(data.paymentGivenToday ?? entry.paymentGivenToday.toNumber())
                .sub(data.balanceReturnedToday ?? entry.balanceReturnedToday.toNumber());
            const computedAllocations = await calculateAllocations(cost, data.allocatedProjects || [], tx);
            const updatedEntry = await tx.ledgerEntry.update({
                where: { id },
                data: {
                    openingBalance: data.openingBalance,
                    paymentGivenToday: data.paymentGivenToday,
                    balanceReturnedToday: data.balanceReturnedToday,
                    cost,
                    workerAdvances: {
                        create: (data.workerAdvances || []).map(wa => ({
                            workerId: wa.workerId,
                            advanceAmount: wa.advanceAmount,
                            targetType: wa.targetType,
                            targetId: wa.targetId
                        }))
                    },
                    completedProjects: {
                        create: (data.completedProjects || []).map(cp => ({
                            targetType: cp.targetType,
                            targetId: cp.targetId
                        }))
                    },
                    allocatedProjects: {
                        create: computedAllocations.map(ap => ({
                            targetType: ap.targetType,
                            targetId: ap.targetId,
                            amount: ap.amount
                        }))
                    }
                },
                include: { allocatedProjects: true }
            });
            // New project cost increments removed (replaced by syncProjectCost below)
            for (const ap of updatedEntry.allocatedProjects) {
                const rootId = await projectService.getRootProjectId(ap.targetType, ap.targetId, tx);
                if (rootId)
                    affectedRootProjects.add(rootId);
            }
            // Apply new attendance advances
            if (data.workerAdvances) {
                for (const wa of data.workerAdvances) {
                    await tx.attendance.upsert({
                        where: { workerId_date: { workerId: wa.workerId, date: entry.date } },
                        update: { advanceGiven: wa.advanceAmount },
                        create: { workerId: wa.workerId, date: entry.date, present: true, advanceGiven: wa.advanceAmount }
                    });
                }
            }
            return { updatedEntry, affectedRootProjects: Array.from(affectedRootProjects), completedProjects: data.completedProjects || [] };
        });
        // Mark projects completed OUTSIDE transaction to avoid timeouts
        for (const cp of result.completedProjects) {
            if (cp.targetType === TargetType.PROJECT) {
                await prisma.project.update({ where: { id: cp.targetId }, data: { status: 'COMPLETED' } });
            }
            else if (cp.targetType === TargetType.SUB_PROJECT) {
                await prisma.subProject.update({ where: { id: cp.targetId }, data: { status: 'COMPLETED' } });
            }
            else if (cp.targetType === TargetType.CHILD_PROJECT) {
                await prisma.childProject.update({ where: { id: cp.targetId }, data: { status: 'COMPLETED' } });
            }
            await projectService.checkAndCascadeCompletion(cp.targetType, cp.targetId, prisma);
        }
        // Sync project costs outside of transaction
        for (const rootId of result.affectedRootProjects) {
            await projectService.syncProjectCost(rootId, prisma);
        }
        // Sync salaries for old workers and new workers
        const workersToSync = new Set([
            ...entry.workerAdvances.map(wa => wa.workerId),
            ...(data.workerAdvances || []).map(wa => wa.workerId)
        ]);
        for (const workerId of workersToSync) {
            await salaryService.syncSalary(workerId, entry.date);
        }
        return result.updatedEntry;
    },
    async delete(id) {
        const entry = await prisma.ledgerEntry.findUnique({
            where: { id },
            include: { allocatedProjects: true, workerAdvances: true, completedProjects: true }
        });
        if (!entry)
            throw new Error('Not found');
        const latest = await prisma.ledgerEntry.aggregate({ _max: { date: true } });
        if (latest._max.date?.getTime() !== entry.date.getTime()) {
            throw new Error('Only the latest ledger entry can be modified or deleted');
        }
        const result = await prisma.$transaction(async (tx) => {
            const affectedRootProjects = new Set();
            for (const ap of entry.allocatedProjects) {
                const rootId = await projectService.getRootProjectId(ap.targetType, ap.targetId, tx);
                if (rootId)
                    affectedRootProjects.add(rootId);
            }
            // Delete attendance records created by this ledger entry's worker advances
            for (const wa of entry.workerAdvances) {
                await tx.attendance.deleteMany({
                    where: { workerId: wa.workerId, date: entry.date }
                });
            }
            const deletedEntry = await tx.ledgerEntry.delete({ where: { id } });
            return { deletedEntry, affectedRootProjects: Array.from(affectedRootProjects) };
        });
        // Revert completed project statuses OUTSIDE transaction to avoid timeouts
        for (const cp of entry.allocatedProjects) {
            await projectService.revertCascadeCompletion(cp.targetType, cp.targetId, prisma);
        }
        // Sync project costs outside of transaction
        for (const rootId of result.affectedRootProjects) {
            await projectService.syncProjectCost(rootId, prisma);
        }
        // Sync salaries
        for (const wa of entry.workerAdvances) {
            await salaryService.syncSalary(wa.workerId, entry.date);
        }
        return result.deletedEntry;
    }
};
//# sourceMappingURL=ledgerService.js.map