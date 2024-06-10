"use server";


import prisma from "@/model";
import { messageSchema } from "@/lib/schema-types";

export async function sendMessage(username: string, messageContent: string) {
  console.log(username, messageContent);

  const { success, error } = messageSchema.safeParse({
    content: messageContent,
  });

  const zodError: string = error?.errors[0].message || "Length required";

  if (!success)
    return {
      success: false,
      message: zodError,
      status: 411,
    };

  try {
    const user = await prisma.user.findFirst({ where: { username } });

    if (!user)
      return {
        success: false,
        message: "There is no user with this username",
        status: 404,
      };

    if (!user.isAcceptingMessages)
      return {
        success: false,
        message: "User is not accepting any messages",
        status: 403,
      };

    const newMessageCreated = await prisma.messages.create({
      data: { content: messageContent, userId: user.id },
    });

    return {
      success: true,
      message: "Message sent successfully to the given user",
      status: 200,
    };
  } catch (error) {
    console.log("Error adding message", error);
    return {
      success: false,
      message: "Error adding message",
      status: 500,
    };
  }
}
