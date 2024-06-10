import { verifySchema } from "@/lib/schema-types";
import prisma from "@/model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, code } = await req.json();

    const decodedUsername = decodeURIComponent(username);

    const { success } = verifySchema.safeParse({ code });

    if (!success)
      return NextResponse.json({
        success: false,
        message: "Invalid inputs",
        status: 411,
      });

    const userExists = await prisma.user.findFirst({ where: { username: decodedUsername } });

    if (!userExists)
      return NextResponse.json({
        success: false,
        message: "User with this username doesn't exist",
        status: 404,
      });

    const isCodeValid = userExists.verifyCode === code;
    const isCodeExpired = new Date(userExists.verifyCodeExpiry) < new Date();

    if (isCodeExpired) {
      return NextResponse.json({
        success: false,
        message: "Your verification code is expired ! Sign up again",
        status: 400,
      });
    } else if (!isCodeValid) {
      return NextResponse.json({
        success: false,
        message: "Incorrect verification code",
        status: 400,
      });
    } else if (!isCodeExpired && isCodeValid) {
      const updatedUser = await prisma.user.update({
        where: { username: decodedUsername },
        data: { isVerified: true },
      });

      if(!updatedUser) return NextResponse.json({
        success: false,
        message: "Couldn't verify user",
        status: 500,
      }); 

      return NextResponse.json({
        success: true,
        message: "Verification successful",
        status: 200,
      });
    }
  } catch (err) {
    console.log(err, "Error verifying user");
    return NextResponse.json({
      success: false,
      message: "Error verifying user",
      status: 500,
    });
  }
}
