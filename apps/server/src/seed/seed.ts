import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const seedUsername = process.env.SEED_ADMIN_USERNAME;
const seedPassword = process.env.SEED_ADMIN_PASSWORD;

async function main() {
  const passwordHash = await bcrypt.hash(seedPassword!, 12);
  await prisma.user.upsert({
    where: { email: seedUsername },
    update: {},
    create: {
      email: seedUsername!,
      passwordHash: passwordHash,
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
