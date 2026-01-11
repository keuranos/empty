import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      isPro?: boolean
      usageCount?: number
    }
  }
}

// In-memory storage for demo (use a database in production)
const users: Record<string, { isPro: boolean; usageCount: number; stripeCustomerId?: string }> = {}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user?.email) {
        const userData = users[session.user.email] || { isPro: false, usageCount: 0 }
        session.user.isPro = userData.isPro
        session.user.usageCount = userData.usageCount
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})

export { handler as GET, handler as POST }
