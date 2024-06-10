"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinSchema, signinType } from "@/lib/schema-types";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<signinType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<signinType> = async (data: signinType) => {
    console.log(data);
    setIsSubmitting(true);

    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    console.log(res);

    if (res && res.ok && res.url) {
      toast({
        title: "Login Successful",
        className:
          "bg-green-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
      });

      router.replace("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description:
          res?.error ||
          "There was a problem with your login. Please try again.",
        className:
          "bg-red-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <main className="w-full h-screen flex justify-center items-center bg-myblue">
      <div className="rounded-lg bg-slate-50 p-10 w-[28rem] sm:scale-[0.85] scale-75">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-center font-poppins">
            Welcome Back to Honest Opinions
          </h1>
          <p className="text-center m-4 font-medium text-lg font-poppins">
            Login to continue your secret conversations
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-md tracking-wide font-poppins">
                      Email/Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email or username"
                        {...field}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-poppins"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 tracking-wide" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-md tracking-wide font-poppins">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-poppins"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 tracking-wide" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-myblue tracking-wider text-slate-50 my-4 font-poppins"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-3" />
                    Please Wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center m-4 font-normal text-lg tracking-wide font-poppins">
            Not a member yet?{" "}
            <Link href="/register" className="text-blue-600 hover:text-myblue">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default page;
