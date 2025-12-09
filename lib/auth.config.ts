import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { compare } from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export const authConfig: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const email = credentials?.email as string | undefined
                const password = credentials?.password as string | undefined

                if (!email || !password) return null

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user) return null

                const isValid = await compare(password, user.hashedpassword)
                if (!isValid) return null

                return {
                    id: user.id.toString(),
                    name: user.name || user.email,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    debug: true,
}
