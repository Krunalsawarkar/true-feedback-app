import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameValidationSchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get("username") };

    // validate with zod
    const result = usernameValidationSchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid Query Parameters",
        },
        { status: 400 }
      );
    }

    //check unique username
    const { username } = result.data;
    const existVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Checking Username", error);
    return Response.json(
      {
        success: false,
        message: "Error Checking Username",
      },
      { status: 500 }
    );
  }
}
