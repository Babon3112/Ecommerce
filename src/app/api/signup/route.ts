"use server";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

interface UserFormData {
  fullname: string;
  email: string;
  password: string;
  verifyUrl: string;
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const verifyUrl = formData.get("verifyUrl") as string;

    if (!fullname || !email || !password || !verifyUrl) {
      throw new Error("All fields are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 90000000).toString();
    const expiryDate = new Date(Date.now() + 3600 * 1000);

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      }

      existingUser.fullname = fullname;
      existingUser.email = email.toLowerCase();
      existingUser.password = hashedPassword;
      existingUser.verifyCode = verifyCode;
      existingUser.verifyCodeExpiry = expiryDate;
      await existingUser.save();
    } else {
      const newUser = new UserModel({
        fullname,
        email: email.toLowerCase(),
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      fullname,
      email,
      verifyCode,
      verifyUrl
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "User signed up successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error.message || "Failed to create user");
  }
}
