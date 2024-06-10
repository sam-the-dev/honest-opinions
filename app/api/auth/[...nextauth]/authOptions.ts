import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "@/model";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        // username: { label: "Username", type: "text", placeholder: "Enter a Unique Username"},
        identifier: { label: "Email/Username", type: "text" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your Password",
        },
      },
      async authorize(credentials: any): Promise<any> {

        try {
          if (!credentials) {
            throw new Error("Missing credentials");
          }

          const { identifier } = credentials;

          const user = await prisma.user.findFirst({
            where: {
              OR: [{ username: identifier }, { email: identifier }],
            },
          });

          if (!user) throw new Error("No user found with this username/email");

          if (!user.isVerified)
            throw new Error("Please verify your account before login");

          const validatePassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!validatePassword) throw new Error("Incorrect Password");

          const { password: _, ...userWithoutPassword } = user;

          return userWithoutPassword;
        } catch (err: any) {
          console.log(err.message);
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id?.toString();
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_URL,
};

// Write Error page logic
// Write skeleton logic
// Strategy in Next Auth
