import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import inventoryRoutes from './routes/inventory.js';
import projectRoutes, { subRouter, childRouter } from './routes/projects.js';
import ledgerRoutes from './routes/ledger.js';
import workerRoutes from './routes/workers.js';
import attendanceRoutes from './routes/attendance.js';
import salaryRoutes from './routes/salary.js';
import quotationRoutes from './routes/quotations.js';
import invoiceRoutes from './routes/invoices.js';
import dashboardRoutes from './routes/dashboard.js';
const app = express();
app.use(cors({
    origin: (origin, cb) => {
        // Allow Electron (null origin / file://), localhost dev server, any localhost port
        const allowed = !origin || origin === 'null' || /^http:\/\/localhost(:\d+)?$/.test(origin);
        cb(null, allowed);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
// Auth
app.use('/api/auth', authRoutes);
// Clients
app.use('/api/clients', clientRoutes);
// Inventory
app.use('/api/inventory', inventoryRoutes);
// Projects — each tier gets its own clean router (no double-prefix)
app.use('/api/projects', projectRoutes);
app.use('/api/subprojects', subRouter);
app.use('/api/childprojects', childRouter);
// Ledger
app.use('/api/ledger', ledgerRoutes);
// Workers + Attendance + Salary
app.use('/api/workers', workerRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes);
// Quotations + Invoices
app.use('/api/quotations', quotationRoutes);
app.use('/api/invoices', invoiceRoutes);
// Dashboard — serves both /api/dashboard and /api/dashboard/stats
app.use('/api/dashboard', dashboardRoutes);
// Global error handler
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map