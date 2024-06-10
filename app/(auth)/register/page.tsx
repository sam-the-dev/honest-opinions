"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CheckUsernameResponse,
  apiResponseType,
  signupSchema,
  signupType,
} from "@/lib/schema-types";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@uidotdev/usehooks";
import { checkUsernameAction } from "@/server-actions/check-username";
import { registerUser } from "@/server-actions/register-user";

const Page = () => {
  const [username, setUsername] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const debouncedUsername = useDebounce<string>(username, 500);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<signupType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    async function checkUsername() {
      if (debouncedUsername) {
        setIsCheckingUsername(true);

        try {
          const data = await checkUsernameAction(debouncedUsername);

          const message = data?.message;
          setUsernameMessage(message);
        } catch (err: any) {
          console.log(err);
          setUsernameMessage(
            err?.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }

    checkUsername();

    return () => {
      setUsernameMessage("");
    };
  }, [debouncedUsername]);

  const onSubmit: SubmitHandler<signupType> = async (data: signupType) => {
    console.log(data);
    setIsSubmitting(true);

    try {
      const res = await registerUser(data.username, data.email, data.password)
      console.log(res);

      if (!res?.success) {
        toast({
          title: "Sign Up Failed",
          description: res?.message,
          className:
            "bg-red-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
        });
        return;
      }

      toast({
        title: "Sign Up Successful",
        description: res?.message,
        className:
          "bg-green-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
      });

      router.replace(`/verify/${username}`);
    } catch (error: any) {
      console.error("Error during sign-up:", error);


      let errorMessage =
        error?.message ||
        "There was a problem with your sign-up. Please try again.";

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        className:
          "bg-red-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full h-screen flex justify-center items-center bg-myblue">
      <div className="rounded-lg bg-slate-50 p-10 w-[28rem] sm:scale-[0.85] scale-75">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-extrabold text-center font-poppins ">
            Join Honest Opinions
          </h1>
          <p className="text-center m-4 font-medium text-lg font-poppins">
            Sign up to start your anonymous adventure
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-md tracking-wide font-poppins">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a unique username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-poppins"
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    {!isCheckingUsername && usernameMessage.length > 0 && (
                      <p
                        className={`${
                          usernameMessage === "Username is available"
                            ? "text-green-500"
                            : "text-red-500"
                        } text-sm tracking-wide font-poppins`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    {form.formState.errors.username && (
                      <p className="text-red-500 text-sm font-poppins">
                        {form.formState.errors.username.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-md tracking-wide font-poppins">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-poppins"
                        placeholder="example@gmail.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm font-poppins">
                        {form.formState.errors.email.message}
                      </p>
                    )}
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
                        placeholder="Enter a strong password"
                        type="password"
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-poppins"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.password && (
                      <p className="text-red-500 text-sm font-poppins">
                        {form.formState.errors.password.message}
                      </p>
                    )}
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
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center m-4 font-normal text-lg tracking-wide font-poppins">
            Already a member?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-poppins"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Page;
