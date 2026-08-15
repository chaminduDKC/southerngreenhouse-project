import prisma from '../lib/prisma.js';
import { CreateQuotationDTO, UpdateQuotationDTO } from '@sg/types';

export const quotationService = {
  async getAll() {
    const list = await prisma.quotation.findMany({
      include: { client: { select: { id: true, name: true } }, project: { select: { id: true, title: true } }, items: true },
      orderBy: { createdAt: 'desc' }
    });
    return list.map(q => ({
      ...q,
      transportCost: q.transportCost.toNumber(),
      total: q.items.reduce((sum, item) => sum + item.qty.toNumber() * item.unitPrice.toNumber(), 0) + q.transportCost.toNumber(),
      items: q.items.map(i => ({ ...i, qty: i.qty.toNumber(), unitPrice: i.unitPrice.toNumber(), lineTotal: i.qty.toNumber() * i.unitPrice.toNumber() }))
    }));
  },

  async getById(id: string) {
    const q = await prisma.quotation.findUniqueOrThrow({
      where: { id },
      include: { client: true, project: true, items: { include: { inventoryItem: true } } }
    });
    return {
      ...q,
      transportCost: q.transportCost.toNumber(),
      total: q.items.reduce((sum, item) => sum + item.qty.toNumber() * item.unitPrice.toNumber(), 0) + q.transportCost.toNumber(),
      items: q.items.map(i => ({ ...i, qty: i.qty.toNumber(), unitPrice: i.unitPrice.toNumber(), lineTotal: i.qty.toNumber() * i.unitPrice.toNumber() }))
    };
  },

  async create(data: CreateQuotationDTO) {
    return prisma.quotation.create({
      data: {
        clientId: data.clientId,
        projectId: data.projectId,
        validUntil: new Date(data.validUntil),
        transportCost: data.transportCost || 0,
        notes: data.notes || "",
        status: data.status || 'DRAFT',
        items: {
          create: data.items.map(item => ({
            inventoryItemId: item.inventoryItemId,
            description: item.description,
            qty: item.qty,
            unitPrice: item.unitPrice
          }))
        }
      }
    });
  },

  async update(id: string, data: UpdateQuotationDTO) {
    return prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.quotationItem.deleteMany({ where: { quotationId: id } });
      }
      return tx.quotation.update({
        where: { id },
        data: {
          clientId: data.clientId,
          projectId: data.projectId,
          validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
          transportCost: data.transportCost,
          notes: data.notes,
          status: data.status,
          ...(data.items && {
            items: {
              create: data.items.map(item => ({
                inventoryItemId: item.inventoryItemId,
                description: item.description,
                qty: item.qty,
                unitPrice: item.unitPrice
              }))
            }
          })
        }
      });
    });
  },

  async delete(id: string) {
    return prisma.quotation.delete({ where: { id } });
  }
};
