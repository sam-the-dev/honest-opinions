"use server";
import { verifySchema } from "@/lib/schema-types";
import prisma from "@/model";

export async function verifyCodeAction(
  username: string,
  code: string | number
) {
  try {
    const decodedUsername = decodeURIComponent(username);

    const { success } = verifySchema.safeParse({ code });

    if (!success)
      return {
        success: false,
        message: "Invalid inputs",
        status: 411,
      };

    const userExists = await prisma.user.findFirst({
      where: { username: decodedUsername },
    });

    if (!userExists)
      return {
        success: false,
        message: "User with this username doesn't exist",
        status: 404,
      };

    const isCodeValid = userExists.verifyCode === code;
    const isCodeExpired = new Date(userExists.verifyCodeExpiry) < new Date();

    if (isCodeExpired) {
      return {
        success: false,
        message: "Your verification code is expired ! Sign up again",
        status: 400,
      };
    } else if (!isCodeValid) {
      return {
        success: false,
        message: "Incorrect verification code",
        status: 400,
      };
    } else if (!isCodeExpired && isCodeValid) {
      const updatedUser = await prisma.user.update({
        where: { username: decodedUsername },
        data: { isVerified: true },
      });

      if (!updatedUser)
        return {
          success: false,
          message: "Couldn't verify user",
          status: 500,
        };

      return {
        success: true,
        message: "Verification successful",
        status: 200,
      };
    }
  } catch (err) {
    console.log(err, "Error verifying user");
    return {
      success: false,
      message: "Error verifying user",
      status: 500,
    };
  }
}
