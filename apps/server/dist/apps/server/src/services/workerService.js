import prisma from '../lib/prisma.js';
export const workerService = {
    async getAll() {
        return prisma.worker.findMany({ orderBy: { workerId: 'asc' } });
    },
    async getById(id) {
        return prisma.worker.findUniqueOrThrow({
            where: { id },
            include: {
                attendances: { orderBy: { date: 'desc' }, take: 30 },
                salaries: { orderBy: [{ year: 'desc' }, { month: 'desc' }] }
            }
        });
    },
    async create(data) {
        return prisma.$transaction(async (tx) => {
            const count = await tx.worker.count();
            const workerId = `WRK-${String(count + 1).padStart(4, '0')}`;
            return tx.worker.create({
                data: {
                    ...data,
                    workerId
                }
            });
        });
    },
    async update(id, data) {
        return prisma.worker.update({ where: { id }, data });
    },
    async delete(id) {
        return prisma.worker.delete({ where: { id } });
    }
};
//# sourceMappingURL=workerService.js.map