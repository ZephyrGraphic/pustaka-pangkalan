import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.updateMany({
    where: { email: '3202202600420001' },
    data: { role: 'ADMIN' },
  });
  console.log('Promoted to ADMIN:', user.count);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
