import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/model";

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);

    const { searchParams } = req.nextUrl;
    console.log(req, searchParams);

    const messageId = searchParams.get("messageId"); 
    
    
    if (!session || !session.user)
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
        status: 401,
      });
  
    try {
      const res = await prisma.messages.delete({
        where: { id: Number(messageId) },
      });
  
      return NextResponse.json({
        success: true,
        message: "Message deleted successfully",
        status: 200,
      });
    } catch (error) {
      console.log("Error deleting message", error);
      return NextResponse.json({
        success: false,
        message: "Error deleting message",
        status: 500,
      });
    }}