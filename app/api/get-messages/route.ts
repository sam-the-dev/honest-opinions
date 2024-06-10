import prisma from "@/model";
import { User, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser: User = session?.user as User;

  if (!session || !sessionUser)
    return NextResponse.json({
      success: false,
      message: "User not authenticated",
      status: 401,
    });

  const userId = sessionUser?.id;

  try {
    // const user = await prisma.user.findFirst({
    //   where: { id: Number(userId) },
    //   include: {
    //     messages: {
    //       orderBy: {
    //         createdAt: "desc",
    //       },
    //     },
    //   },
    // });

    const messages = await prisma.messages.findMany({
      where: { userId: Number(userId) },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(messages);

    // if (!user || user.messages.length === 0)
    //   return NextResponse.json({
    //     success: false,
    //     message: "User messages not found",
    //     status: 404,
    //   });

    if (!messages || messages.length === 0)
      return NextResponse.json({
        success: false,
        message: "User messages not found",
        status: 404,
      });

    return NextResponse.json({
      success: true,
      message: "User messages found",
      userMessages: messages,
      status: 200,
    });
  } catch (error) {
    console.log("An unexpected error occurred:", error);
    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred !",
      status: 500,
    });
  }
}
