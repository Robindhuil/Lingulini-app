import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@lingulini.com' },
    update: {},
    create: {
      email: 'admin@lingulini.com',
      name: 'Admin',
      hashedpassword: hashedPassword,
      role: 'ADMIN',
      nativeLanguage: 'en',
      learningLanguages: [],
    },
  })

  console.log('✅ Admin user created (email: admin@lingulini.com, password: admin123)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
