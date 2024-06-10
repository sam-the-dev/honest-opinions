"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
  verifySchema,
  verifySchemaType,
} from "@/lib/schema-types";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyCodeAction } from "@/server-actions/verify-code";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  const { username } = useParams();

  const form = useForm<verifySchemaType>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<verifySchemaType> = async (
    data: verifySchemaType
  ) => {
    const code = data.code.toString();
    setIsSubmitting(true);

    try {
      const usernameStr = Array.isArray(username) ? username[0] : username;

      const data = await verifyCodeAction(usernameStr, code);
      console.log(data);

      if (!data?.success) {
        toast({
          description:
            data?.message || "Verification Failed ! Please try again.",
          className:
            "bg-red-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
        });
        return;
      }

      toast({
        description: data?.message || "Verification Successful",
        className:
          "bg-green-500 text-slate-50 outline-none text-lg tracking-wide font-medium",
      });

      router.replace("/login");
    } catch (error: any) {
      console.error("Error during verification:", error);
      let errorMessage =
        error?.message ||
        "Verification Failed ! Please try again.";

      toast({
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
      <div className="rounded-lg bg-slate-50 p-10 w-[28rem]">
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-extrabold text-center font-poppins ">
            Verify Your Account
          </h1>
          <p className="text-center m-4 font-medium text-lg font-poppins">
            Enter the verification code sent to your email
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-poppins">
                      One-Time Password
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        value={verificationCode}
                        onChange={(value) => {
                          const code = value.toString();
                          field.onChange(value);
                          setVerificationCode(code);
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>

                    <FormMessage className="text-red-500 font-poppins" />
                  </FormItem>
                )}
              />
              <div className="text-center text-sm font-poppins">
                {verificationCode === "" ? (
                  <>Enter your one-time password send to your email</>
                ) : (
                  <>You entered: {verificationCode}</>
                )}
              </div>
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
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default page;
