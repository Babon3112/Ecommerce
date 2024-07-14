"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Announcements = () => {
  return (
    <div className="h-8 bg-[#f4f4f4] text-black flex items-center justify-center text-[15px] w-screen font-medium">
      <ChevronLeft />
      <p className="mx-6">Get 10% off on bussiness sign up</p>
      <ChevronRight />
    </div>
  );
};

export default Announcements;
