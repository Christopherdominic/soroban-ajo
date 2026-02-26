import { prisma } from './config/database';

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
