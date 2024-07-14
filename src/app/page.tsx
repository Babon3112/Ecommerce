"use client";
import Announcements from "@/components/Announcements";
import { Interests } from "@/components/Interests";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Navbar />
      <Announcements />
      {session && (
        <div>
          <Interests />
        </div>
      )}
    </>
  );
}
