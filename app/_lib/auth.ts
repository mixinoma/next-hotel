import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

/**
 * Extend the default NextAuth types to include our custom user field: guestId
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      guestId?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    guestId?: string | null;
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * Used to allow or block access to routes.
     */
    authorized({ auth, request }: { auth: any; request: Request }) {
      return !!auth?.user;
    },

    /**
     * Add custom guest data when a user signs in.
     */
    async signIn({ user }: { user: any }) {
      try {
        let guest = await getGuest(user.email!);
        if (!guest) guest = await createGuest(user);
        user.guestId = guest.id; // attach to user
        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return false;
      }
    },

    /**
     * Persist the guestId in the session object.
     */
    async session({ session, user }: { session: any; user: any }) {
      session.user.guestId = user.guestId ?? null;
      return session;
    },
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
export default authConfig;
