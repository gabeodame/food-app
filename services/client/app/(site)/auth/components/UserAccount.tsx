"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "./Avatar";
import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import LogoutButton from "../../components/LogoutButton";
import useUser from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import UserProfile from "./UserProfile";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CiUser } from "react-icons/ci";
import { PiBowlFoodDuotone } from "react-icons/pi";
import { useAppContext } from "@/context/AppContext";

function UserAccount() {
  const { user, isLoading, isError } = useUser();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const {
    state: { profile },
    setProfile,
  } = useAppContext();

  const handleLogout = () => {
    setDropdownOpen(false); // Close the dropdown after logout
    setProfile(null); // Clear the profile from the context
    router.push("/");
  };

  type MenuItem = {
    label: string;
    component?: React.ReactNode;
    defaultChecked?: boolean;
  };

  const menuItems: MenuItem[] = [
    {
      label: "Customize Profile",
      component: (
        <Link href="/auth/profile/?action=update" passHref>
          <div className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <FiEdit2 />
            <span>Customize Profile</span>
          </div>
        </Link>
      ),
    },
    {
      label: "My Recipes",
      defaultChecked: false,
      component: (
        <Link href="/auth/dashboard" passHref>
          <div className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <PiBowlFoodDuotone />
            <span> My Recipes</span>
          </div>
        </Link>
      ),
    },
    { label: "Favorited Recipes", defaultChecked: false },
    {
      label: "Logout",
      component: (
        <div className="w-full flex flex-col">
          <DropdownMenuSeparator className="my-4 h-[2px]" />
          <LogoutButton onLogout={handleLogout} />
        </div>
      ),
    },
  ];
  console.log("UserAccount -> user", user);
  return (
    <div className="relative">
      {user ? (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              {user && <UserProfile email={user?.email} />}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="top-full right-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50"
            sideOffset={5}
            alignOffset={5}
          >
            <DropdownMenuLabel className="px-4 py-2 text-sm font-medium">
              User Options
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="border-t" />
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.component ? (
                  <DropdownMenuItem>{item.component}</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>{item.label}</DropdownMenuItem>
                )}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}

export default UserAccount;

const LoginButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="w-full px-4 justify-start items-center"
      onClick={() => router.push("/auth")}
    >
      Login
    </Button>
  );
};
