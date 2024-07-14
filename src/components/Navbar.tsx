"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Search, ShoppingCart } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div>
      <div className="flex justify-end h-8 space-x-8 text-sm items-end mr-4">
        <p>Help</p>
        <p>Order & Returns</p>
        {session && <p>Hi, {session?.user.fullname}</p>}
      </div>
      <div className="flex h-14 w-screen items-center justify-between">
        <h1 className="font-bold font-serif text-2xl w-1/4 text-center">
          Ecommerce.
        </h1>
        <div className="flex space-x-8 font-semibold w-1/2 justify-center">
          <p>Categories</p>
          <p>Sale</p>
          <p>Clearnce</p>
          <p>New stock</p>
          <p>Trending</p>
        </div>
        <div className="flex space-x-6 w-1/4 justify-center">
          <Search className="cursor-pointer" />
          <ShoppingCart className="cursor-pointer" />
          {session ? (
            <div
              onClick={() => signOut()}
              className="flex cursor-pointer items-center font-semibold"
            >
              Logout
              <LogOut className="size-4" />
            </div>
          ) : (
            <>
              <Link
                href="/signup"
                className="flex items-center text-sm cursor-pointer font-semibold text-gray-600 transition-colors hover:text-gray-800"
              >
                SIGN UP
              </Link>
              <Link
                href="/signin"
                className="flex items-center text-sm cursor-pointer font-semibold text-gray-600 transition-colors hover:text-gray-800"
              >
                SIGN IN
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
