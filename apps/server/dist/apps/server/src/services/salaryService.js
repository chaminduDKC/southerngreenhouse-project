import { RateType } from '@prisma/client';
import prisma from '../lib/prisma.js';
export const salaryService = {
    async getAll() {
        return prisma.salary.findMany({
            include: { worker: { select: { id: true, name: true, workerId: true, rateType: true, rate: true } } },
            orderBy: [{ year: 'desc' }, { month: 'desc' }]
        });
    },
    async getById(id) {
        return prisma.salary.findUniqueOrThrow({
            where: { id },
            include: { worker: { select: { id: true, name: true, workerId: true, rateType: true, rate: true } } }
        });
    },
    async getHistory(id) {
        const salary = await prisma.salary.findUniqueOrThrow({ where: { id } });
        const { workerId, month, year } = salary;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        // Query LedgerWorkerAdvance directly — each row is one individual payment entry
        const ledgerAdvances = await prisma.ledgerWorkerAdvance.findMany({
            where: {
                workerId,
                ledgerEntry: { date: { gte: startDate, lte: endDate } }
            },
            include: { ledgerEntry: true },
            orderBy: { ledgerEntry: { date: 'asc' } }
        });
        const { projectService } = await import('./projectService.js');
        const dailyPaidHistory = await Promise.all(ledgerAdvances.map(async (adv) => {
            let targetTitle;
            if (adv.targetType && adv.targetId) {
                targetTitle = await projectService.resolveTargetName(adv.targetType, adv.targetId, prisma);
            }
            return {
                date: adv.ledgerEntry.date.toISOString(),
                amount: adv.advanceAmount.toNumber(),
                targetType: adv.targetType ?? null,
                targetId: adv.targetId ?? null,
                targetTitle: targetTitle ?? null
            };
        }));
        return {
            workerId,
            month,
            year,
            advancesTotal: salary.advancesTotal.toNumber(),
            dailyPaidHistory
        };
    },
    async calculate(data) {
        const { workerId, month, year } = data;
        const worker = await prisma.worker.findUniqueOrThrow({ where: { id: workerId } });
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const attendances = await prisma.attendance.findMany({
            where: { workerId, date: { gte: startDate, lte: endDate } }
        });
        const daysWorked = attendances.filter(a => a.present).length;
        // dailyPaid = sum of daily payments made through ledger entries
        const dailyPaid = attendances.reduce((sum, a) => sum + a.dailyPaid.toNumber(), 0);
        let basePay = 0;
        if (worker.rateType === RateType.DAILY) {
            basePay = worker.rate.toNumber() * daysWorked;
        }
        else {
            basePay = worker.rate.toNumber();
        }
        return {
            workerId, month, year, daysWorked, basePay, dailyPaid, bonuses: 0, deductions: 0, advancesTotal: 0, netPay: basePay - dailyPaid
        };
    },
    async save(data) {
        return prisma.salary.upsert({
            where: { workerId_month_year: { workerId: data.workerId, month: data.month, year: data.year } },
            update: {
                daysWorked: data.daysWorked,
                basePay: data.basePay,
                dailyPaid: data.dailyPaid,
                bonuses: data.bonuses,
                deductions: data.deductions,
                advancesTotal: data.advancesTotal,
                netPay: data.netPay
            },
            create: { ...data }
        });
    },
    async update(id, data) {
        const current = await prisma.salary.findUniqueOrThrow({ where: { id } });
        const dailyPaid = data.dailyPaid !== undefined ? data.dailyPaid : current.dailyPaid.toNumber();
        const bonuses = data.bonuses !== undefined ? data.bonuses : current.bonuses.toNumber();
        const deductions = data.deductions !== undefined ? data.deductions : current.deductions.toNumber();
        const advancesTotal = data.advancesTotal !== undefined ? data.advancesTotal : current.advancesTotal.toNumber();
        const netPay = data.netPay !== undefined
            ? data.netPay
            : current.basePay.toNumber() + bonuses - deductions - dailyPaid - advancesTotal;
        return prisma.salary.update({
            where: { id },
            data: { ...data, dailyPaid, bonuses, deductions, advancesTotal, netPay }
        });
    },
    async syncSalary(workerId, date) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const existingSalary = await prisma.salary.findUnique({
            where: { workerId_month_year: { workerId, month, year } }
        });
        if (existingSalary) {
            const calc = await this.calculate({ workerId, month, year });
            const bonuses = existingSalary.bonuses.toNumber();
            const deductions = existingSalary.deductions.toNumber();
            const advancesTotal = existingSalary.advancesTotal.toNumber();
            const netPay = calc.basePay + bonuses - deductions - calc.dailyPaid - advancesTotal;
            await prisma.salary.update({
                where: { id: existingSalary.id },
                data: {
                    daysWorked: calc.daysWorked,
                    basePay: calc.basePay,
                    dailyPaid: calc.dailyPaid,
                    netPay: netPay
                }
            });
        }
    },
    async delete(id) {
        const salary = await prisma.salary.findUniqueOrThrow({ where: { id } });
        const { workerId, month, year } = salary;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        return prisma.$transaction(async (tx) => {
            // 1. Delete LedgerWorkerAdvance records for this worker in this month/year
            const ledgerEntries = await tx.ledgerEntry.findMany({
                where: { date: { gte: startDate, lte: endDate } },
                select: { id: true }
            });
            const ledgerEntryIds = ledgerEntries.map(e => e.id);
            if (ledgerEntryIds.length > 0) {
                await tx.ledgerWorkerAdvance.deleteMany({
                    where: {
                        workerId,
                        ledgerEntryId: { in: ledgerEntryIds }
                    }
                });
            }
            // 2. Reset Attendance dailyPaid to 0 for this worker in this month/year
            await tx.attendance.updateMany({
                where: {
                    workerId,
                    date: { gte: startDate, lte: endDate }
                },
                data: {
                    dailyPaid: 0
                }
            });
            // 3. Delete the salary record itself
            return tx.salary.delete({ where: { id } });
        });
    }
};
//# sourceMappingURL=salaryService.js.map