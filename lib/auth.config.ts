import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'

const prisma = new PrismaClient()

export const authConfig: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const username = credentials?.username as string | undefined
                const password = credentials?.password as string | undefined

                if (!username || !password) return null

                const user = await prisma.user.findUnique({
                    where: { username },
                })

                if (!user) return null

                const isValid = await compare(password, user.hashedpassword)
                if (!isValid) return null

                return {
                    id: user.id.toString(),
                    name: user.username,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    debug: true,
}
