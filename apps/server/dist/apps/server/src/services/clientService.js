import prisma from '../lib/prisma.js';
export const clientService = {
    async getAll(search) {
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        return prisma.client.findMany({
            where,
            include: {
                _count: {
                    select: { projects: true, quotations: true, invoices: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },
    async getById(id) {
        return prisma.client.findUniqueOrThrow({
            where: { id, deletedAt: null },
            include: {
                projects: {
                    include: {
                        subProjects: {
                            include: { children: true }
                        }
                    }
                },
                quotations: true,
                invoices: true
            }
        });
    },
    async create(data) {
        return prisma.client.create({ data });
    },
    async update(id, data) {
        return prisma.client.update({ where: { id }, data });
    },
    async softDelete(id) {
        return prisma.client.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
//# sourceMappingURL=clientService.js.map