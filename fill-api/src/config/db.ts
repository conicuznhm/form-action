import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();
console.log('Connecting to:', process.env.DATABASE_URL);

export default prisma;