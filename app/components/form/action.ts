"use server";

import ContactFormEmail from "../emails/contact-template";
import { Resend } from "resend";
import * as z from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export type FormState = {
  success?: boolean;
  error?: string;
  message?: string;
};
export async function submitContactForm(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const formSchema = z.object({
      email: z.email(),
      name: z.string().max(50, "Name is too long"),
      subject: z.string().max(100, "Subject is too long"),
      message: z
        .string()
        .max(600, "Message should be less than 600 characters"),
    });

    const { data, success } = formSchema.safeParse(
      Object.fromEntries(formData.entries())
    );
    if (!success)
      return {
        success: false,
        error: "Please enter a valid email address",
      };

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [data.email],
      replyTo: data.email,
      subject: `New Inquiry: ${data.subject}`,
      react: ContactFormEmail({
        message: data.message,
        senderEmail: data.email,
        subject: data.subject,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: "Failed to send email. Please try again.",
      };
    }

    return {
      success: true,
      message: "Success! I'll get back to you as soon as possible.",
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
