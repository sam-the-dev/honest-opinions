import { z } from "zod";

const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be of minimum 3 letters" })
    .max(30, { message: "Username can't exceed 30 letters" })
    .regex(/^[a-zA-Z0-9]+$/, "Username must not contain special characters"),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Can't exceed 100 letters" }),
});

const signinSchema = z
  .object({
    identifier: z.string(),
    password: z.string(),
  })
  .refine(
    (data) => {
      if (data.identifier.length === 0) {
        return false;
      } else return true;
    },
    {
      message: "Username/Email is required !",
      path: ["identifier"],
    }
  )
  .refine(
    (data) => {
      if (data.password.length === 0) {
        return false;
      } else return true;
    },
    {
      message: "Password is required !",
      path: ["password"],
    }
  );

const verifySchema = z.object({
  code: z.string().length(6, { message: "Verification code must be 6 digits" }),
});

const acceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});

const messageSchema = z.object({
  content: z
    .string()
    .min(5, { message: "Message should be at least of 5 characters" })
    .max(500, { message: "Message should not exceed 500 characters" }),
});

const apiResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  error: z.any().optional(),
  success: z.boolean(),
  userMessages: z
    .array(
      z.object({
        id: z.number(),
        content: z.string(),
        createdAt: z.string(),
        userId: z.number(),
      })
    )
    .optional(),
});

const fetchAcceptMessageAPIResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  error: z.any().optional(),
  success: z.boolean(),
  isAcceptingMessages: z.boolean()
});


export type signupType = z.infer<typeof signupSchema>;
export type signinType = z.infer<typeof signinSchema>;
export type verifySchemaType = z.infer<typeof verifySchema>;
export type acceptMessageSchemaType = z.infer<typeof acceptMessageSchema>;
export type messageSchemaType = z.infer<typeof messageSchema>;
export type apiResponseType = z.infer<typeof apiResponseSchema>;
export type acceptMesssageApiResponseType = z.infer<typeof fetchAcceptMessageAPIResponseSchema>;

export type CheckUsernameResponse = {
  success: boolean;
  message: string;
  status: number;
};


export interface sendEmailProps {
  username: string;
  email: string;
  verificationCode: string;
}

export interface EmailTemplateProps {
  username: string;
  verificationCode: string;
}

export interface MessageProps {
  id: number;
  content: string;
  createdAt: Date;
  userId: number;
}

export {
  signinSchema,
  signupSchema,
  verifySchema,
  acceptMessageSchema,
  messageSchema,
  apiResponseSchema,
};
