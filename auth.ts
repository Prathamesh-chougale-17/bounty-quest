import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Twitter],
  pages: {
    signIn: "/login",
  },
});
