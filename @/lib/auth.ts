import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return profile?.email_verified
      }
      return true
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error(`Auth error: ${code}`, metadata)
    },
    warn(code) {
      console.warn(`Auth warning: ${code}`)
    },
    debug(code, metadata) {
      console.log(`Auth debug: ${code}`, metadata)
    },
  },
}

