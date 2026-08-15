import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { CreateAttendanceDTO, UpdateAttendanceDTO, BulkAttendanceDTO } from '@sg/types';
import { salaryService } from './salaryService.js';

export const attendanceService = {
  async getAll(filters: { workerId?: string; startDate?: string; endDate?: string; date?: string }) {
    const where: Prisma.AttendanceWhereInput = {};
    if (filters.workerId) where.workerId = filters.workerId;
    if (filters.date) {
      const d = new Date(filters.date);
      where.date = { gte: new Date(d.setHours(0,0,0,0)), lte: new Date(d.setHours(23,59,59,999)) };
    } else if (filters.startDate && filters.endDate) {
      where.date = { gte: new Date(filters.startDate), lte: new Date(filters.endDate) };
    }
    
    return prisma.attendance.findMany({
      where,
      include: { worker: { select: { id: true, name: true, workerId: true } } },
      orderBy: { date: 'desc' }
    });
  },

  async create(data: CreateAttendanceDTO) {
    const record = await prisma.attendance.create({
      data: {
        workerId: data.workerId,
        date: new Date(data.date),
        present: data.present,
        dailyPaid: data.dailyPaid || 0
      }
    });
    await salaryService.syncSalary(record.workerId, record.date);
    return record;
  },

  async bulkUpsert(data: BulkAttendanceDTO) {
    const date = new Date(data.date);
    const result = await prisma.$transaction(
      data.records.map(record => 
        prisma.attendance.upsert({
          where: { workerId_date: { workerId: record.workerId, date } },
          update: { present: record.present, dailyPaid: record.dailyPaid || 0 },
          create: { workerId: record.workerId, date, present: record.present, dailyPaid: record.dailyPaid || 0 }
        })
      )
    );
    
    // Sync salary for all workers involved
    for (const record of data.records) {
      await salaryService.syncSalary(record.workerId, date);
    }
    
    return result;
  },

  async update(id: string, data: UpdateAttendanceDTO) {
    const record = await prisma.attendance.update({ where: { id }, data });
    await salaryService.syncSalary(record.workerId, record.date);
    return record;
  },

  async delete(id: string) {
    const record = await prisma.attendance.delete({ where: { id } });
    await salaryService.syncSalary(record.workerId, record.date);
    return record;
  }
};
