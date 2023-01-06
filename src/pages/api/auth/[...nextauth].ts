import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const useSecureCookies = !!process.env.VERCEL_URL;

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  // This code is only necessary for subdomains

  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
};
export default NextAuth(authOptions);
