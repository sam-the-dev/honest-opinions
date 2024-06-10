import { Resend } from "resend";
import { VerificationEmailDesign } from "@/components/VerifyEmailDesign";
import { sendEmailProps } from "./schema-types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  username,
  email,
  verificationCode,
}: sendEmailProps) {
  const subject = `Hi ${username}, your verification code is here...`;

  try {
    const send = await resend.emails.send({
      from: "Honest Opinions <thedev.sam09@gmail.com>",
      to: email,
      subject,
      react: VerificationEmailDesign({ username, verificationCode }),
    });
    console.log(send);

    return {
      success: true,
      message: "Verification email sent successfully",
      status: 200,
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Failed to send verification email.",
      status: 500,
    };
  }
}
