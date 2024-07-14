import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, code } = await request.json();
    const decodedEmail = decodeURIComponent(email);
    const user = await UserModel.findOne({ email: decodedEmail });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date() < new Date(user.verifyCodeExpiry!);
    const isAlreadyVerified = user.isVerified;

    if (isAlreadyVerified) {
      return Response.json(
        {
          success: false,
          message: "User already verified",
        },
        { status: 400 }
      );
    }

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      user.verifyCode = undefined;
      user.verifyCodeExpiry = undefined;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    }

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Invalid verification code",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user.",
      },
      { status: 500 }
    );
  }
}
