"use server";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/model";


export async function deleteMessageFromDatabase(messageId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user)
    return {
      success: false,
      message: "User not authenticated",
      status: 401,
    };

  try {
    const res = await prisma.messages.delete({
      where: { id: Number(messageId) },
    });

    return {
      success: true,
      message: "Message deleted successfully",
      status: 200,
    };
  } catch (error) {
    console.log("Error deleting message", error);
    return {
      success: false,
      message: "Error deleting message",
      status: 500,
    };
  }
}
