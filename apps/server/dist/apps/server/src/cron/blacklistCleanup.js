import cron from 'node-cron';
import prisma from '../lib/prisma.js';
export const setupBlacklistCleanup = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            const result = await prisma.tokenBlacklist.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date()
                    }
                }
            });
            console.log(`[Cron] Cleaned up ${result.count} expired blacklisted tokens.`);
        }
        catch (error) {
            console.error('[Cron] Error cleaning up blacklist:', error);
        }
    });
};
//# sourceMappingURL=blacklistCleanup.js.map