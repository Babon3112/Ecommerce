import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const userId = session.user._id;
    const { interests } = await request.json();

    if (!Array.isArray(interests)) {
      return Response.json(
        {
          success: false,
          message: "Interests must be an array",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { interests } },
      { new: true }
    );

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        interests: user.interests,
        message: "Interests updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}
