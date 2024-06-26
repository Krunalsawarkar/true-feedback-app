import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../../types/ApiResponse";

export async function SendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onborading@resend.dev",
      to: email,
      subject: "True Feedback Verification Code",
        react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification Email sended Sucessfully!!",
    };
  } catch (emailError) {
    console.error("Error Sending Verification email", emailError);
    return { success: false, message: "Failed to send Verification Email" };
  }
}
