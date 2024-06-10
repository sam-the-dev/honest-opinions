"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  apiResponseType,
  messageSchema,
  messageSchemaType,
} from "@/lib/schema-types";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import axios, { Axios, AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { sendMessage } from "@/server-actions/send-message";

const defaultMessages = [
  { id: 0, message: "What type of movies are you in?" },
  { id: 1, message: `What's your dream job?` },
  { id: 3, message: `What's your go-to coffee order?` },
];

const Page = () => {
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSuggestMessageLoading, setIsSuggestMessageLoading] =
    useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [click, setClick] = useState<number>(0);
  const { toast } = useToast();
  const { username } = useParams();

  const form = useForm<messageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const { watch, setValue, handleSubmit, reset } = form;
  const content = watch("content");

  useEffect(() => {
    const hours24 = 24 * 60 * 60 * 1000;

    if (click === 3) {
      setTimeout(() => {
        setClick(0);
      }, 5000);
    }
  }, [click, setClick]);

  const handleSuggestMessageClick = function () {
    setClick((prev) => prev + 1);
    setIsSuggestMessageLoading(true);
  };

  const onSubmit: SubmitHandler<messageSchemaType> = async (
    data: messageSchemaType
  ) => {
    setLoading(true);

    try {
      const usernameStr = Array.isArray(username) ? username[0] : username;

      const res = await sendMessage(usernameStr, data.content);

      setApiResponse(res?.message);
    } catch (error: any) {
      handleAPIError(error, "Error while sending message");
    } finally {
      setLoading(false);
      reset();
    }
  };

  const handleAPIError = (error: any, defaultMessage: string) => {
    console.error(defaultMessage, error?.message);

    const errorMessage = error?.message || defaultMessage + "! Try again";
    toast({
      description: errorMessage,
      className:
        "bg-red-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
    });
  };

  return (
    <>
      <main className="w-full min-h-screen xl:px-[20rem] lg:px-[16rem] md:px-[12rem] sm:px-[8rem] px-[6rem] py-[2rem] bg-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-center font-poppins">
            Public Profile Link
          </h1>

          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full sm:space-y-6 space-y-4"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="sm:my-5 my-3">
                    <FormLabel className="text-base font-poppins">
                      Send Anonymous Message to @{username}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-800 font-poppins"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.length > 0) {
                            setValue("content", e.target.value);
                            setDisabled(false);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 font-poppins" />
                    {apiResponse && (
                      <FormMessage
                        className={`font-poppins ${
                          apiResponse ===
                          "Message sent successfully to the given user"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {apiResponse}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-center">
                {isLoading ? (
                  <Button
                    type="submit"
                    disabled
                    className="w-40 text-base tracking-wide font-poppins bg-myblue hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 text-gray-50 items-center scale-75 sm:scale-100"
                  >
                    <LoaderCircle className="animate-spin mr-3" />
                    Please Wait
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isDisabled || !content}
                    className="w-24 text-sm tracking-wide font-poppins bg-myblue hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 text-gray-50 items-center scale-75 sm:scale-100"
                  >
                    Send
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="flex flex-col">
            {isSuggestMessageLoading ? (
              <Button
                type="submit"
                disabled
                className="w-40 text-base tracking-wide font-poppins bg-myblue hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 text-gray-50 items-center scale-75 sm:scale-100"
              >
                <LoaderCircle className="animate-spin mr-3" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={click === 3 ? true : false}
                onClick={handleSuggestMessageClick}
                className="text-sm w-[10rem] tracking-wide font-poppins bg-myblue hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 text-gray-50 items-center mt-7 scale-75 sm:scale-100"
              >
                Suggest Messages
              </Button>
            )}

            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base sm:mt-3 mb-3 mt-1 font-poppins">
              Click any messages below to select it
            </label>
          </div>
          <div className="w-full rounded-md shadow-lg border-gray-200 border-[0.5px] p-5 flex flex-col">
            <h1 className="text-lg font-bold font-poppins ">Messages</h1>
            {defaultMessages.map((defaultMsg) => (
              <div key={defaultMsg.id}>
                <Button
                  className="border-[1px] border-gray-200 font-poppins shadow-sm w-full tracking-wide mt-4 hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200"
                  onClick={() => {
                    setValue("content", defaultMsg.message);
                    setDisabled(false);
                  }}
                >
                  {defaultMsg.message}
                </Button>
              </div>
            ))}
          </div>

          <Separator className="bg-gray-200 h-[0.1rem] my-6" />

          <div className="flex flex-col items-center justify-center w-full gap-4">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base text-center font-poppins">
              Get your Message Board
            </label>
            <Link href={"/register"}>
              <Button
                type="button"
                className="text-sm w-[11rem] mx-auto tracking-wide bg-[#111827] font-poppins bg-myblue hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 text-gray-50 items-center"
              >
                Create your Account
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
