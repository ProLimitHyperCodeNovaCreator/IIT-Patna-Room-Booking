import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { jwtDecode } from "jwt-decode";

// Extended Session Type
interface ExtendedSession extends Session {
  accessToken?: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[];
  };
}

// Extended JWT Type
interface ExtendedJWT extends JWT {
  accessToken?: string;
  roles?: string[]; // Changed from role (singular) to roles (array)
}

// Azure Profile Type
interface AzureADProfile {
  email?: string;
  name?: string;
  oid?: string;
  preferred_username?: string;
  [key: string]: any;
}

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: "common", // for multi-tenant auth
      authorization: {
        params: {
          prompt: "select_account",
          // Add scope for roles - this is critical
          scope: "openid profile email User.Read",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // Only on initial sign-in
      if (account && profile) {
        console.log("🔐 Signing in with AzureAD...");
        console.log("👤 Profile:", JSON.stringify(profile, null, 2));
        console.log("🪪 Account:", JSON.stringify(account, null, 2));
  
        token.accessToken = account.access_token;
        const extendedToken = token as ExtendedJWT;
        const azureProfile = profile as AzureADProfile;
        
        // Initialize roles array
        extendedToken.roles = [];
  
        // ✅ Decode roles from id_token if available
        if (account.id_token) {
          try {
            const decodedIdToken = jwtDecode<any>(account.id_token);
            console.log("🔓 Decoded ID Token:", JSON.stringify(decodedIdToken, null, 2));
  
            if (decodedIdToken.roles && Array.isArray(decodedIdToken.roles)) {
              console.log("🧾 Roles from ID token:", decodedIdToken.roles);
              extendedToken.roles = decodedIdToken.roles;
            } else {
              console.log("❌ No roles array found in ID token.");
            }
          } catch (err) {
            console.error("❗ Failed to decode id_token:", err);
          }
        }
  
        // ✅ Fallback to email-based role (if no roles from token)
        if (!extendedToken.roles || extendedToken.roles.length === 0) {
          if (
            azureProfile?.email?.includes("admin") ||
            azureProfile?.email === "omeshmehta70@gmail.com" ||
            azureProfile?.email?.endsWith("@youradmindomain.com")
          ) {
            extendedToken.roles = ["admin"];
          } else {
            extendedToken.roles = ["user"];
          }
          console.log("📧 Assigned roles based on email:", extendedToken.roles);
        }
        
        return extendedToken;
      }
      
      // For subsequent requests, preserve the roles array
      return token;
    },
  
    async session({ session, token }) {
      console.log("📦 Creating session from token:", JSON.stringify(token, null, 2));
      
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedJWT;
  
      // Copy access token
      extendedSession.accessToken = extendedToken.accessToken;
  
      // Ensure user object exists
      if (!extendedSession.user) {
        extendedSession.user = {};
      }
      
      // Explicitly assign roles from token to session
      extendedSession.user.roles = extendedToken.roles || ["user"];
      
      console.log("🔄 Final session object:", JSON.stringify(extendedSession, null, 2));
      
      return extendedSession;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt", // Explicitly set JWT strategy
    maxAge: 60 * 60, // 1 hour
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
