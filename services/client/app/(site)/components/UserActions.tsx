"use client";

import React from "react";
import UserAccount from "../auth/components/UserAccount";
import ModeToggle from "@/components/ui/ModeToggle";

const UserActions = () => {
  return (
    <div className="flex items-center gap-4">
      <ModeToggle />
      <UserAccount />
    </div>
  );
};

export default UserActions;
