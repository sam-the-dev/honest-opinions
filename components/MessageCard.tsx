"use client";

import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MessageProps, apiResponseType } from "@/lib/schema-types";
import { useToast } from "./ui/use-toast";
import { Messages } from "@prisma/client";
import axios, { AxiosError } from "axios";

type MessageCardProps = {
  message: MessageProps;
  onMessageDelete: (messageId: Number) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const dateString = new Date(message?.createdAt).toLocaleString() || "Unknown";

  async function handleDeleteMessage() {
    try {
      const messageId = message?.id.toString();

      const res = await axios.delete<apiResponseType>(
        `/api/delete-message?messageId=${messageId}`
      );

      if (res?.data?.success) {
        toast({
          description: res?.data?.message,
          className:
            "bg-red-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
        });

        onMessageDelete(message.id);
      }
    } catch (error) {
      console.error("Error while deleting message:", error);

      const axiosError = error as AxiosError<apiResponseType>;

      let errorMessage =
        axiosError.response?.data.message ||
        "Error while deleting message ! Try again";

      toast({
        description: errorMessage,
        className:
          "bg-red-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
      });
    }
  }

  return (
    <Card className="xl:w-[28rem] lg:w-[18rem] sm:w-[16rem] w-[22rem] p-5 flex justify-between min-h-40 bg-myskin">
      <CardHeader className="max-w-[19rem]">
        <CardDescription className="font-poppins font-base text-myblue">
          {dateString}
        </CardDescription>
        <CardTitle className="xl:text-base text-sm font-[600] font-poppins text-left text-myblue">
          {message?.content || "No Message"}
        </CardTitle>
      </CardHeader>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="bg-red-500 rounded-md w-[3rem] h-[2rem]"
          >
            <X className="w-5 h-5 text-white " />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold font-poppins">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-poppins">
              This action cannot be undone. This will permanently delete your
              message from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMessage}
              className="bg-[#111827] text-white"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MessageCard;
