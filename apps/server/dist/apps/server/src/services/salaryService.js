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
    async calculate(data) {
        const { workerId, month, year } = data;
        const worker = await prisma.worker.findUniqueOrThrow({ where: { id: workerId } });
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const attendances = await prisma.attendance.findMany({
            where: { workerId, date: { gte: startDate, lte: endDate } }
        });
        const daysWorked = attendances.filter(a => a.present).length;
        const advancesTotal = attendances.reduce((sum, a) => sum + a.advanceGiven.toNumber(), 0);
        let basePay = 0;
        if (worker.rateType === RateType.DAILY) {
            basePay = worker.rate.toNumber() * daysWorked;
        }
        else {
            basePay = worker.rate.toNumber();
        }
        const netPay = basePay - advancesTotal;
        return {
            workerId, month, year, daysWorked, basePay, advancesTotal, bonuses: 0, deductions: 0, netPay
        };
    },
    async save(data) {
        return prisma.salary.upsert({
            where: { workerId_month_year: { workerId: data.workerId, month: data.month, year: data.year } },
            update: {
                daysWorked: data.daysWorked,
                basePay: data.basePay,
                bonuses: data.bonuses,
                deductions: data.deductions,
                advancesTotal: data.advancesTotal,
                netPay: data.netPay
            },
            create: { ...data }
        });
    },
    async update(id, data) {
        return prisma.salary.update({ where: { id }, data });
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
            const netPay = calc.basePay + bonuses - deductions - calc.advancesTotal;
            await prisma.salary.update({
                where: { id: existingSalary.id },
                data: {
                    daysWorked: calc.daysWorked,
                    basePay: calc.basePay,
                    advancesTotal: calc.advancesTotal,
                    netPay: netPay
                }
            });
        }
    }
};
//# sourceMappingURL=salaryService.js.map