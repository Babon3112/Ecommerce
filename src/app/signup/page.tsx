"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/schemas/signupSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Navbar from "@/components/Navbar";
import Announcements from "@/components/Announcements";

const Signup = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("email", data.email);
      formData.append("password", data.password);

      let verifyUrl = "";
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      verifyUrl = `${baseUrl}/verify/${data.email}`;
      formData.append("verifyUrl", verifyUrl);

      setIsSubmitting(true);
      await axios.post("/api/signup", formData).then((response) => {
        if (response.status === 201) {
          router.replace(`/verify/${data.email}`);
        }
      });
      setIsSubmitting(false);
    } catch (error: any) {
      setIsSubmitting(false);
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <Announcements />
      <div className="w-screen h-[52rem] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-[25rem] p-8 bg-white bg-opacity-90 rounded-3xl shadow-lg border border-gray-400">
          <h1 className="text-center text-2xl font-normal mb-5 text-gray-800">
            CREATE AN ACCOUNT
          </h1>
          <Form {...form}>
            <form
              className="flex flex-col w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="fullname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Full name"
                        className="flex-1 min-w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                        className="flex-1 min-w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex w-full">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Your Password"
                          {...field}
                          className="flex-1 p-4 border rounded-none rounded-l-md border-gray-300 focus:outline-none focus:border-black border-r-0"
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                        <Button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`p-4 text-gray-500 border-gray-300 rounded-none rounded-r-md hover:bg-white border border-l-0 bg-transparent ${
                            isFocused
                              ? "outline-none border-black border border-l-0"
                              : ""
                          }`}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 text-lg font-medium text-white bg-black rounded-md transition-all duration-300 ease-in-out"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Please wait...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <hr className="my-6 bg-black w-full" />
          <p className="text-center">
            Already have an account?{" "}
            <Link href="/signin" className="underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
