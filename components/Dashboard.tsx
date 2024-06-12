"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import {
  MessageProps,
  acceptMessageSchema,
  acceptMessageSchemaType,
} from "@/lib/schema-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllMessages } from "@/server-actions/get-messages";
import {
  getAcceptMessages,
  postAcceptMessages,
} from "@/server-actions/accept-messages";
import { deleteMessageFromDatabase } from "@/server-actions/delete-message";

const Dashboard = ({ baseUrl }: { baseUrl: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const { toast } = useToast();

  const form = useForm<acceptMessageSchemaType>({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const profileLink = useMemo(() => {
    const username = session?.user?.username;
    return username ? `${baseUrl}/u/${username}` : "";
  }, [session, baseUrl]);

  useEffect(() => {
    if (session) {
      fetchAllMessages();
      fetchAcceptMessage();
    }
  }, []);

  const handleAPIError = useCallback(
    (error: any, defaultMessage: string) => {
      console.error(defaultMessage, error?.message);

      const errorMessage = error?.message || defaultMessage + "! Try again";
      toast({
        description: errorMessage,
        className:
          "bg-red-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
      });
    },
    [toast]
  );

  const fetchAcceptMessage = useCallback(
    async function () {
      setIsSwitchLoading(true);

      try {
        const data = await getAcceptMessages();

        if (!data?.success) return;

        const isAcceptingMessages: boolean =
          data?.isAcceptingMessages as boolean;

        setValue("acceptMessages", isAcceptingMessages);
      } catch (error: any) {
        handleAPIError(error, "Error while fetching message acceptance status");
      } finally {
        setIsSwitchLoading(false);
      }
    },
    [setIsSwitchLoading, setValue, acceptMessages, handleAPIError, toast]
  );

  const fetchAllMessages = useCallback(async () => {
    setIsLoading(true);
    setIsSwitchLoading(true);

    try {
      const res = await getAllMessages();
      console.log(res);

      const messageData = res?.userMessages;

      if (messageData && messageData.length > 0) {
        setMessages(messageData);
        toast({
          description: "Refreshed User Messages",
          className:
            "bg-green-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
        });
      }
    } catch (error: any) {
      handleAPIError(error, "Error while fetching user messages");
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [messages, setIsLoading, setIsSwitchLoading, handleAPIError, toast]);

  const deleteMessage = useCallback(
    async (messageId: Number) => {
      try {
        const messageID = messageId.toString();

        const res = await deleteMessageFromDatabase(messageID);

        if (res?.success) {
          const updatedMessages = messages.filter(
            (msg) => msg.id !== messageId
          );
          setMessages(updatedMessages);
          toast({
            description: res?.message,
            className:
              "bg-red-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
          });
        }
      } catch (error: any) {
        handleAPIError(error, "Error while deleting message !");
      }
    },
    [messages, setMessages, handleAPIError, toast]
  );

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);

      toast({
        title: "URL Copied Successfully",
        className:
          "bg-green-500 text-slate-50 outline-none text-lg tracking-wide font-medium ",
      });
    } catch (error: any) {
      handleAPIError(error, "Failed to Copy URL");
    }
  };

  const handleSwitchChange = useCallback(
    async function () {
      try {
        const value: boolean = !acceptMessages;
        const res = await postAcceptMessages(value);

        setValue("acceptMessages", !acceptMessages);

        toast({
          title: "Message Acceptance Status Updated",
          description: res?.message,
          className:
            "bg-green-500 text-slate-50 outline-none text-lg tracking-wide font-medium ",
        });
      } catch (error: any) {
        handleAPIError(error, "Error while updating message acceptance status");
      }
    },
    [isSwitchLoading, setValue, acceptMessages, handleAPIError, toast]
  );

  return (
    <div className="py-8 md:mx-[10rem] sm:mx-[5rem] mx-[2rem] lg:mx-[18rem]">
      <h1 className="text-3xl font-bold mb-3 font-poppins text-gray-50">
        User Dashboard
      </h1>

      <label className="font-medium text-lg font-poppins text-gray-50">
        Copy Your Unique Link
      </label>

      <div className="mb-4 mt-1 flex">
        <input
          disabled
          value={profileLink || `Couldn't generate link ! Login again.`}
          type="text"
          className="w-full p-2 px-5 mr-2 bg-gray-100 rounded-md border border-gray-200 font-poppins"
        />
        <Button
          type="button"
          className="bg-myskin hover:bg-orange-500 focus:bg-orange-500 active:bg-orange-500 sm:text-sm sm:w-[8rem] text-xs w-[6rem] text-myblue font-poppins"
          onClick={copyURL}
        >
          Copy Link
        </Button>
      </div>

      <div className="flex gap-3">
        <Switch
          {...register("acceptMessages")}
          disabled={isSwitchLoading}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
        />
        <p className="text-base font-poppins text-gray-50">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </p>
      </div>

      <Separator className="bg-gray-200 h-[0.1rem] my-4" />

      <Button
        variant={"default"}
        className="w-10 h-8 p-0 font-poppins bg-myskin"
        onClick={fetchAllMessages}
      >
        {isLoading ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <RefreshCcw size={16} />
        )}
      </Button>

      <div className=" w-full flex flex-wrap xl:gap-8 md:gap-6 gap-4 2xl:justify-evenly xl:justify-around sm:justify-evenly justify-center mt-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id}>
              <MessageCard
                message={message}
                key={message.id}
                onMessageDelete={deleteMessage}
              />
            </div>
          ))
        ) : (
          <p className="text-lg font-poppins tracking-wide font-medium text-gray-50">
            No Messages to Display
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
