import { AppError } from 'src/utils/AppError.js';
import prisma from '../lib/prisma.js';
import { CreateWorkerDTO, UpdateWorkerDTO } from '@sg/types';

export const workerService = {
  async getAll() {
    return prisma.worker.findMany({ orderBy: { workerId: 'asc' } });
  },

  async getById(id: string) {
    return prisma.worker.findUniqueOrThrow({
      where: { id },
      include: {
        attendances: { orderBy: { date: 'desc' }, take: 30 },
        salaries: { orderBy: [{ year: 'desc' }, { month: 'desc' }] }
      }
    });
  },

  async create(data: CreateWorkerDTO) {
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

  async update(id: string, data: UpdateWorkerDTO) {
    return prisma.worker.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      await tx.attendance.deleteMany({ where: { workerId: id } });
      await tx.salary.deleteMany({ where: { workerId: id } });
      await tx.ledgerWorkerAdvance.deleteMany({ where: { workerId: id } });
      return tx.worker.delete({ where: { id } });
    });
  }
};
