import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    const passwordHash = await bcrypt.hash('Admin@1234', 12);
    await prisma.user.upsert({
        where: { email: 'admin@southerngreehouse.com' },
        update: {},
        create: {
            email: 'admin@southerngreehouse.com',
            passwordHash,
        },
    });
    console.log('Seed completed.');
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map