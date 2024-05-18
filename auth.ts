import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getUserById } from "@/data/user"
import { getAccountByUserId } from "@/data/account"
import { AccountRole, UserRole } from "@prisma/client"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    }
  },
  callbacks: {
    async signIn({ user, account}) {
      // Allow Oauth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      // TODO: Add 2FA check

      return true;
    },
    async session({ token, session, trigger, newSession }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as AccountRole;
      }
      if (token.userRole && session.user) {
        session.user.userRole = token.userRole as UserRole;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id
      );


      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      if (trigger === "signIn") {
        token.userRole = UserRole.NONE;
      }

      if (trigger === "update" && session.userRole) {
        token.userRole = session.userRole
      }

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
    ...authConfig,
})