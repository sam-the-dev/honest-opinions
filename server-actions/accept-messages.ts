"use server";

import prisma from "@/model";
import { getServerSession } from "next-auth";
import { acceptMessageSchema } from "@/lib/schema-types";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function getAcceptMessages() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user)
    return {
      success: false,
      message: "User not authenticated",
      status: 401,
    };

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user)
      return {
        success: false,
        message: "User not found",
        status: 404,
      };

    return {
      success: true,
      message: "User found",
      status: 200,
      isAcceptingMessages: user?.isAcceptingMessages,
    };
  } catch (error) {
    console.log("Error retrieving message acceptance status", error);
    return {
      success: false,
      message: "Error retrieving message acceptance status",
      status: 500,
    };
  }
}

export async function postAcceptMessages(acceptMessages: boolean) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user)
    return {
      success: false,
      message: "User not authenticated",
      status: 401,
    };

  const id = session.user.id;

  const { success } = acceptMessageSchema.safeParse({ acceptMessages });

  if (!success)
    return {
      success: false,
      message: "Invalid inputs",
      status: 411,
    };

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { isAcceptingMessages: acceptMessages },
      select: { isAcceptingMessages: true },
    });

    if (!updatedUser)
      return {
        success: false,
        message: "Unable to find user to update message acceptance status",
        status: 404,
      };

    return {
      success: true,
      message: "User message acceptance status updated successfully",
      status: 200,
    };
  } catch (error) {
    console.log("Error updating message acceptance status", error);
    return {
      success: false,
      message: "Error updating message acceptance status",
      status: 500,
    };
  }
}
