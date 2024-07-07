import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodeUser = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodeUser,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 500 }
      );
    }

    const isValidCode = user.verifyCode === code;
    const isValidCodeExp = new Date(user.verifyCodeExp) > new Date();

    if (isValidCode && isValidCodeExp) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account Verified Successfully",
        },
        { status: 200 }
      );
    } else if (!isValidCodeExp) {
      return Response.json(
        {
          success: false,
          message: "Verification code Expired!!",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification Code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error Verifying User", error);
    return Response.json(
      {
        success: false,
        message: "Error Checking Username",
      },
      { status: 500 }
    );
  }
}
