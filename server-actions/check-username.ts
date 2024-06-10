"use server";
import { CheckUsernameResponse } from "@/lib/schema-types";
import prisma from "@/model";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be of minimum 3 letters" })
    .max(30, { message: "Username can't exceed 30 letters" })
    .regex(/^[a-zA-Z0-9]+$/, "Username must not contain special characters"),
});

export async function checkUsernameAction(username: string) {
  try {
    const res = usernameQuerySchema.safeParse({ username });
    const usernameErrors = res?.error?.format().username?._errors || [];

    if (!res.success) {
      return {
        success: false,
        message:
          usernameErrors?.length > 0
            ? usernameErrors?.join(", ")
            : "Invalid username",
        status: 400,
      };
    }

    const existingVerifiedUsername = await prisma.user.findFirst({
      where: { username, isVerified: true },
    });
    console.log(existingVerifiedUsername);

    if (existingVerifiedUsername) {
      return {
        success: false,
        message: "Username already taken",
        status: 400,
      };
    }

    return {
      success: true,
      message: "Username is available",
      status: 200,
    };
  } catch (err: any) {
    console.log(err.message);
    return {
      success: false,
      message: "Error while checking username",
      status: 500,
    };
  }
}
