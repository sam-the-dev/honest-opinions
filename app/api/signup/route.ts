import prisma from "@/model";
import {
  messageSchema,
  signupSchema,
  signupType,
} from "../../../lib/schema-types";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const { success } = signupSchema.safeParse({ email, username, password });

    if (!success)
      return Response.json({success: false, status: 411, message: "Incorrect inputs" });

    const existingUserVerifiedByUsername = await prisma.user.findFirst({
      where: { username, isVerified: true },
    });

    if (existingUserVerifiedByUsername) {
      return Response.json({
        success: false,
        message: "Username is already taken",
        status: 400,
      });
    }

    const existingUserByEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User already exists with this email !",
          status: 400,
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date(Date.now() + 3600000);
        const updatedUser = await prisma.user.update({
          where: { id: existingUserByEmail.id },
          data: {
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
          },
        });
      }
    } else {
      const verifyCodeExpiry = new Date();
      verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry,
        },
      });
    }
    const emailResponse = await sendEmail({
      username,
      email,
      verificationCode: verifyCode,
    });

    if (!emailResponse.success)
      return Response.json({
        success: false,
        message: emailResponse.message,
        status: 500,
      });

    return Response.json({
      success: true,
      message: "User registered successfully",
      status: 201,
    });
  } catch (err) {
    console.log("Error registering user ", err);
    return Response.json({
      status: 500,
      success: false,
      message: "Error  registering user",
      error: err,
    });
  }
}

// If existingUserByEmail exists then
//    if existingUserByEmail is Verified then
//         Success: false
//    Else
//         Save the updated user
//    End if
// Else
//    Create a new user, verify the user, save the user.

// Verify

// TODO
// Try using NextResponse.json()
