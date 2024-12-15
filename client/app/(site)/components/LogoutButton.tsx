"use client";

import fetchData from "@/app/util/fetchData";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();
  function handleLogout() {
    const logout = async () => {
      const res = await fetchData("/api/users/signout", "post");
      console.log(res.data);
      if (!res.errors) {
        router.refresh();
      }
    };
    logout();
  }
  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="w-full px-8 justify-start items-center"
    >
      {" "}
      Logout
    </Button>
  );
}

export default LogoutButton;
