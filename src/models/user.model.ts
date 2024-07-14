import mongoose, { Schema, Document, Model } from "mongoose";

export interface User extends Document {
  fullname: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifyCode: string | undefined;
  verifyCodeExpiry: Date | undefined;
  interests: string[];
}

const userSchema: Schema<User> = new Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "please enter a valid email"],
    },
    password: { type: String, required: [true, "Password is required"] },
    isVerified: { type: Boolean, default: false },
    verifyCode: { type: String },
    verifyCodeExpiry: {
      type: Date,
    },
    interests: [{ type: String }],
  },
  { timestamps: true }
);

const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
