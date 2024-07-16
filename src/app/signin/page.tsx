"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signinSchema } from "@/schemas/signinSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Announcements from "@/components/Announcements";

const SigninPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        setIsSubmitting(false);
      } else if (result?.url) {
        router.replace("/");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[52rem]">
      <div className="flex flex-col items-center justify-center w-96 p-8 bg-white bg-opacity-90 rounded-3xl  shadow-lg border border-gray-400">
        <h1 className="text-center text-2xl font-normal mb-5">Welcome Back</h1>
        <Form {...form}>
          <form
            className="flex flex-col w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Registered email ..."
                      {...field}
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 text-lg font-medium text-white bg-black rounded-md transition-all duration-300 ease-in-out"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <hr className="my-6 bg-black w-full" />
        <p className=" text-center">
          New to EazyBuy?{" "}
          <Link href="/signup" className="font-semibold underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
