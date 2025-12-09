import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await hash('admin123', 10)

    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@example.com',
            name: 'Administrator',
            hashedpassword: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log('✅ Admin user created (username: admin, password: admin123)')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
