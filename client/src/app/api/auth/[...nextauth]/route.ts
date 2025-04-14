import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"

// Define the type for our extended session
interface ExtendedSession extends Session {
  accessToken?: string
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

// Define the type for our extended JWT
interface ExtendedJWT extends JWT {
  accessToken?: string
  role?: string
}

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: "common", // For multi-tenant authentication
      authorization: {
        params: {
          prompt: "select_account", // Force account selection every time
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and user info to the token
      if (account) {
        token.accessToken = account.access_token

        // Store user role - in a real app, you would determine this from
        // claims in the token or from your database
        if (profile?.email) {
          // Example: assign roles based on email domain or specific addresses
          // This is just an example - replace with your actual role logic
          if (
            profile.email.includes("admin") ||
            profile.email.endsWith("@youradmindomain.com") ||
            profile.email === "omesh@yourdomain.com" || "aditya_2301cb03@iitp.ac.in"
          ) {
            token.role = "admin"
          } else {
            token.role = "user"
          }
        }
      }
      return token as ExtendedJWT
    },
    async session({ session, token }) {
      // Send properties to the client with proper type casting
      const extendedSession = session as ExtendedSession
      const extendedToken = token as ExtendedJWT

      extendedSession.accessToken = extendedToken.accessToken
      extendedSession.user.role = extendedToken.role

      return extendedSession
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  // Ensure sessions are short-lived to force re-authentication
  session: {
    maxAge: 60 * 60, // 1 hour
  },
})

export { handler as GET, handler as POST }
