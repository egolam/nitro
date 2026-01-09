import { Resend } from "resend";
import "dotenv";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailValues {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendEmailValues) {
  try {
    const { error } = await resend.emails.send({
      from: "MARESANS | <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    if (error) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}
