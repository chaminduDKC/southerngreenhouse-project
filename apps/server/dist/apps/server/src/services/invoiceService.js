import prisma from '../lib/prisma.js';
export const invoiceService = {
    async getAll() {
        const list = await prisma.invoice.findMany({
            include: { client: { select: { id: true, name: true } }, project: { select: { id: true, title: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return list.map(i => {
            const amountDue = i.amountDue.toNumber();
            const isOverdue = new Date(i.dueDate).getTime() < Date.now() && amountDue > 0;
            return {
                ...i,
                totalAmount: i.totalAmount.toNumber(),
                amountDue,
                isOverdue
            };
        });
    },
    async getById(id) {
        const i = await prisma.invoice.findUniqueOrThrow({
            where: { id },
            include: { client: true, project: true, quotation: true }
        });
        return {
            ...i,
            totalAmount: i.totalAmount.toNumber(),
            amountDue: i.amountDue.toNumber(),
        };
    },
    async create(data) {
        return prisma.invoice.create({
            data: {
                clientId: data.clientId,
                projectId: data.projectId,
                quotationId: data.quotationId,
                totalAmount: data.totalAmount,
                amountDue: data.amountDue,
                dueDate: new Date(data.dueDate),
                notes: data.notes || ""
            }
        });
    },
    async update(id, data) {
        return prisma.invoice.update({
            where: { id },
            data: {
                ...data,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined
            }
        });
    },
    async delete(id) {
        return prisma.invoice.delete({ where: { id } });
    }
};
//# sourceMappingURL=invoiceService.js.map