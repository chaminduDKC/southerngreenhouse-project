import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof ZodError) {
        return res.status(400).json({ success: false, error: 'Validation Error', details: err.errors });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({ success: false, error: 'Unique constraint failed' });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
};
//# sourceMappingURL=errorHandler.js.map