import nextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    email?: string;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
  }
  interface Session {
    user: {
      id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
