import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect to unauthenticated users
      } else if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [], // Empty array to be populated in auth.ts



} satisfies NextAuthConfig

