import React, { useState } from "react";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  CreditCard,
  Settings,
  Keyboard,
  Users,
  UserPlus,
  Heart,
  Mail,
  MessageSquare,
  PlusCircle,
  Plus,
  Github,
  LifeBuoy,
  Cloud,
  LogOut,
} from "lucide-react";

export default function MobileMenuIcon() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div
            onClick={() => setOpen(!open)}
            className="w-full flex justify-end"
          >
            {open ? (
              <Cross1Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
            ) : (
              <HamburgerMenuIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="fixed inset-y-0 right-0 sm:relative sm:inset-auto w-[90vw] mx-auto h-fit sm:h-auto bg-white z-50 overflow-y-auto p-4 shadow-lg">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <CreditCard />
              <span>My Recipes</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Heart />
              <span>Favorite Recipes</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus />
                <span>Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-full bg-white">
                <DropdownMenuItem>
                  <Mail />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <LifeBuoy />
            <span>Support</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
