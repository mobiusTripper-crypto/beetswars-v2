import NextAuth, { type AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { readLoginList } from "utils/database/loginID.db";

const useSecureCookies = !!process.env.VERCEL_URL;
async function userlist() {
  return await readLoginList();
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const isAllowedToSignIn = (await userlist()).includes(user.name || "");
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    // if modification of the callbackUrl is required us this
    // async redirect({ url, baseUrl }) {
    //   console.log(url, baseUrl);
    //   return url;
    // },
  },

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
