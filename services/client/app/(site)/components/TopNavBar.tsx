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
      <div className="w-full flex items-center justify-between px-4">
        {/* Left Section */}

        <Logo />

        <div className="max-w-7xl p-2 md:p-4 lg:p-6 md:gap-4 md:container sm:px-2 md:px-4">
          <div className="w-full flex justify-between items-center gap-4">
            <div className="hidden md:block">
              <NavigationMenu />{" "}
            </div>
            {/* Center Section */}
            <div className="hidden md:block flex-grow max-w-lg">
              <CustomSearchBar />
            </div>
          </div>
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
