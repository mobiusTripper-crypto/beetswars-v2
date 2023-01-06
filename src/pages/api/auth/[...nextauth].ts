import NextAuth from "next-auth";
import { Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const useSecureCookies = !!process.env.VERCEL_URL;

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: ".solutions-subdomain-auth.vercel.sh",
        secure: useSecureCookies,
      },
    },
  },
};
export default NextAuth(authOptions);
