"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

import MobileMenu from "./MobileMenu";
import CustomSearchBar from "@/components/widgets/CustomSearchBar";
import UserActions from "./UserActions";
import NavigationMenu from "./NavigationMenu";

const TopNavBar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full h-16 bg-white dark:bg-muted dark:border-b dark:border-gray-800 shadow-md flex items-center",
        { "bg-slate-100": isSticky }
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Logo />
          <div className="hidden md:block">
            {" "}
            <NavigationMenu />{" "}
          </div>
        </div>

        {/* Center Section */}
        <div className="hidden md:block flex-grow max-w-lg">
          <CustomSearchBar />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <UserActions />
          </div>
          <div className="block md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
