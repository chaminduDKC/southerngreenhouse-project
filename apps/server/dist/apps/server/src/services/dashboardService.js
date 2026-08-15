import prisma from '../lib/prisma.js';
export const dashboardService = {
    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const [activeProjects, totalClients, monthlyInvoices, overdueInvoices, inventoryItems, activeWorkers, monthlyLedgerEntries, projectsByStatus] = await Promise.all([
            prisma.project.count({ where: { status: { not: 'COMPLETED' } } }),
            prisma.client.count({ where: { deletedAt: null } }),
            prisma.invoice.findMany({ where: { createdAt: { gte: firstDayOfMonth } } }),
            prisma.invoice.findMany({ where: { dueDate: { lt: today }, amountDue: { gt: 0 } } }),
            prisma.inventoryItem.findMany(),
            prisma.worker.count(),
            prisma.ledgerEntry.findMany({ where: { date: { gte: firstDayOfMonth } } }),
            prisma.project.groupBy({ by: ['status'], _count: { status: true } })
        ]);
        const allProjects = await prisma.project.findMany({
            include: {
                subProjects: {
                    include: { children: true }
                }
            }
        });
        const getLeafRevenue = (startD, endD) => {
            let rev = 0;
            const isCompletedInPeriod = (node) => {
                if (node.status !== 'COMPLETED')
                    return false;
                if (endD) {
                    return node.updatedAt >= startD && node.updatedAt <= endD;
                }
                return node.updatedAt >= startD;
            };
            for (const p of allProjects) {
                if (p.subProjects.length === 0) {
                    if (isCompletedInPeriod(p))
                        rev += p.value.toNumber();
                }
                else {
                    for (const sub of p.subProjects) {
                        if (sub.children.length === 0) {
                            if (isCompletedInPeriod(sub))
                                rev += sub.value.toNumber();
                        }
                        else {
                            for (const child of sub.children) {
                                if (isCompletedInPeriod(child))
                                    rev += child.value.toNumber();
                            }
                        }
                    }
                }
            }
            return rev;
        };
        const monthlyRevenue = getLeafRevenue(firstDayOfMonth);
        const outstandingBalance = overdueInvoices.reduce((sum, inv) => sum + inv.amountDue.toNumber(), 0);
        const lowStockCount = inventoryItems.filter(item => item.quantity.lessThanOrEqualTo(item.lowStockThreshold)).length;
        const monthlyCost = monthlyLedgerEntries.reduce((sum, e) => sum + e.cost.toNumber(), 0);
        const breakdown = {
            active: projectsByStatus.find(p => p.status === 'ACTIVE')?._count.status || 0,
            inProgress: projectsByStatus.find(p => p.status === 'IN_PROGRESS')?._count.status || 0,
            completed: projectsByStatus.find(p => p.status === 'COMPLETED')?._count.status || 0,
            onHold: projectsByStatus.find(p => p.status === 'ON_HOLD')?._count.status || 0,
        };
        const recentCompletionsRaw = await prisma.ledgerCompletedProject.findMany({
            include: { ledgerEntry: true },
            orderBy: { ledgerEntry: { date: 'desc' } },
            take: 5
        });
        const recentCompletions = [];
        for (const rc of recentCompletionsRaw) {
            let title = "Unknown";
            if (rc.targetType === 'PROJECT') {
                const p = await prisma.project.findUnique({ where: { id: rc.targetId } });
                if (p)
                    title = p.title;
            }
            else if (rc.targetType === 'SUB_PROJECT') {
                const p = await prisma.subProject.findUnique({ where: { id: rc.targetId }, include: { project: true } });
                if (p)
                    title = `${p.project.title} > ${p.title}`;
            }
            else {
                const p = await prisma.childProject.findUnique({ where: { id: rc.targetId }, include: { subProject: { include: { project: true } } } });
                if (p)
                    title = `${p.subProject.project.title} > ${p.subProject.title} > ${p.title}`;
            }
            recentCompletions.push({
                id: rc.id,
                title,
                targetType: rc.targetType,
                completedAt: rc.ledgerEntry.date.toISOString()
            });
        }
        const revenueVsCost = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const endD = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59, 999);
            let rev = getLeafRevenue(d, endD);
            const ledgers = await prisma.ledgerEntry.findMany({ where: { date: { gte: d, lte: endD } } });
            const cst = ledgers.reduce((s, x) => s + x.cost.toNumber(), 0);
            revenueVsCost.push({
                month: d.toLocaleString('default', { month: 'short' }),
                revenue: rev,
                cost: cst
            });
        }
        return {
            activeProjects,
            totalClients,
            monthlyRevenue,
            outstandingBalance,
            lowStockCount,
            activeWorkers,
            monthlyCost,
            projectStatusBreakdown: breakdown,
            revenueVsCost,
            recentCompletions
        };
    }
};
//# sourceMappingURL=dashboardService.js.map