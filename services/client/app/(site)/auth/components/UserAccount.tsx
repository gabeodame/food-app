"use client";
import React, { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";

import fetchData from "@/app/util/fetchData";
import {
  DropdownMenuCheckboxes,
  // DropdownMenuItem,
} from "@/components/widgets/DropdownMenuCheckboxes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { currentUser } from "@gogittix/common";
import useUser from "@/app/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import Login from "./Login";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "./Avatar";

const menuItems = [
  { trigger: "Profile" },
  { trigger: "Settings" },
  { trigger: "Logout" },
];

type Checked = DropdownMenuCheckboxItemProps["checked"];

export interface DropdownMenuItem {
  label: string;
  defaultChecked?: Checked;
  disabled?: boolean;
  component?: React.ReactNode;
}

export interface DropdownMenuComponentProps {
  triggerComponent: React.ReactNode;
  items: DropdownMenuItem[];
  label?: string;
  separator?: boolean;
}

function UserAccount({ items }: { items: DropdownMenuItem[] }) {
  const [checkedStates, setCheckedStates] = React.useState<Checked[]>(
    items.map((item) => item.defaultChecked ?? false)
  );

  const { user, isError, isLoading } = useUser();
  // const currentUser = user?.currentUser;
  console.log("isLoading", isLoading);

  const handleCheckedChange = (index: number, checked: boolean) => {
    setCheckedStates((prev) => {
      const newCheckedStates = [...prev];
      newCheckedStates[index] = checked;
      return newCheckedStates;
    });
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : user ? (
        <div className="ml-24">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2">
                {user ? <Avatar user={user} /> : <LoginButton />}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              sideOffset={10}
              alignOffset={5}
            >
              <DropdownMenuLabel>
                <p>User Options</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.map((item, index) =>
                item.component ? (
                  <React.Fragment key={index}>{item.component}</React.Fragment>
                ) : (
                  <DropdownMenuCheckboxItem
                    key={index}
                    checked={checkedStates[index]}
                    onCheckedChange={(checked) =>
                      handleCheckedChange(index, checked)
                    }
                    disabled={item.disabled}
                  >
                    {item.label}
                  </DropdownMenuCheckboxItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <LoginButton />
      )}
    </>
  );
}

export default UserAccount;

const LoginButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className="w-full px-8 justify-start items-center"
      onClick={() => router.push("/auth")}
    >
      Login
    </Button>
  );
};
