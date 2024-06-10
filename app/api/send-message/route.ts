import prisma from "@/model";
import { NextRequest, NextResponse } from "next/server";
import { messageSchema } from "@/lib/schema-types";

export async function POST(req: NextRequest) {
  const { username, messageContent } = await req.json();
  console.log(username, messageContent)

  const { success, error } = messageSchema.safeParse({ content: messageContent });

  const zodError: string = error?.errors[0].message || 'Length required';

  if (!success)
    return NextResponse.json({
      success: false,
      message: zodError,
      status: 411,
    });

  try {
    const user = await prisma.user.findFirst({ where: { username } });

    if (!user)
      return NextResponse.json({
        success: false,
        message: "There is no user with this username",
        status: 404,
      });

    if (!user.isAcceptingMessages)
      return NextResponse.json({
        success: false,
        message: "User is not accepting any messages",
        status: 403,
      });

    const newMessageCreated = await prisma.messages.create({
      data: { content: messageContent, userId: user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully to the given user",
      status: 200,
    });
  } catch (error) {
    console.log("Error adding message", error);
    return NextResponse.json({
      success: false,
      message: "Error adding message",
      status: 500,
    });
  }
}
