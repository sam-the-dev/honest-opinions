import prisma from "@/model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { acceptMessageSchema } from "@/lib/schema-types";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user)
    return NextResponse.json({
      success: false,
      message: "User not authenticated",
      status: 401,
    });

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user)
      return NextResponse.json({
        success: false,
        message: "User not found",
        status: 404,
      });

    return NextResponse.json({
      success: true,
      message: "User found",
      status: 200,
      isAcceptingMessages: user?.isAcceptingMessages,
    });
  } catch (error) {
    console.log("Error retrieving message acceptance status", error);
    return NextResponse.json({
      success: false,
      message: "Error retrieving message acceptance status",
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user)
    return NextResponse.json({
      success: false,
      message: "User not authenticated",
      status: 401,
    });

  const { acceptMessages } = await req.json();
  const id = session.user.id;

  const { success } = acceptMessageSchema.safeParse({ acceptMessages });

  if (!success)
    return NextResponse.json({
      success: false,
      message: "Invalid inputs",
      status: 411,
    });

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { isAcceptingMessages: acceptMessages },
      select: { isAcceptingMessages: true },
    });

    if (!updatedUser)
      return NextResponse.json({
        success: false,
        message: "Unable to find user to update message acceptance status",
        status: 404,
      });

    return NextResponse.json({
      success: true,
      message: "User message acceptance status updated successfully",
      status: 200,
    });
  } catch (error) {
    console.log("Error updating message acceptance status", error);
    return NextResponse.json({
      success: false,
      message: "Error updating message acceptance status",
      status: 500,
    });
  }
}
