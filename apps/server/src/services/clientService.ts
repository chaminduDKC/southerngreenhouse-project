import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { CreateClientDTO, UpdateClientDTO } from '@sg/types';

export const clientService = {
  async getAll(search?: string) {
    const where: Prisma.ClientWhereInput = { deletedAt: null };
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

  async getById(id: string) {
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

  async create(data: CreateClientDTO) {
    return prisma.client.create({ data });
  },

  async update(id: string, data: UpdateClientDTO) {
    return prisma.client.update({ where: { id }, data });
  },

  async softDelete(id: string) {
    return prisma.client.update({ where: { id }, data: { deletedAt: new Date() } });
  }
};
