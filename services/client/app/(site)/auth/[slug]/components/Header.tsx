import Link from "next/link";
import React from "react";
import { IoCreateOutline } from "react-icons/io5";

export default function Header() {
  return (
    <div className="w-full flex mx-auto">
      <header className="h-5rem  max-w-7xl p-2 md:p-4 lg:p-6 md:gap-4 md:container  sm:px-2 md:px-4 flex justify-between items-center">
        <Link href="/auth/profile" className="">
          <h1 className="text-4xl font-bold text-color-primary">Dashboard</h1>
        </Link>
        <Link
          href="/auth/recipe/?action=create"
          className="flex gap-2 py-2 px-4 rounded-sm bg-color-secondary text-white justify-center items-center"
        >
          <IoCreateOutline className="w-4 h-4" />
          <div className="">Recipe</div>
        </Link>
      </header>
    </div>
  );
}
