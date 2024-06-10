"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { apiResponseType } from "@/lib/schema-types";
import prisma from "@/model";
import { User, getServerSession } from "next-auth";

export async function getAllMessages() {
  const session = await getServerSession(authOptions);
  const sessionUser: User = session?.user as User;

  if (!session || !sessionUser)
    return {
      success: false,
      message: "User not authenticated",
      status: 401,
    };

  const userId = sessionUser?.id;

  try {
    const messages = await prisma.messages.findMany({
      where: { userId: Number(userId) },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(messages);

    if (!messages || messages.length === 0)
      return {
        success: false,
        message: "User messages not found",
        status: 404,
      };

    return {
      success: true,
      message: "User messages found",
      userMessages: messages,
      status: 200,
    };
  } catch (error) {
    console.log("An unexpected error occurred:", error);
    return {
      success: false,
      message: "An unexpected error occurred !",
      status: 500,
    };
  }
}
