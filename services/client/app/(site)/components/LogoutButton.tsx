"use client";

import fetchData from "@/app/util/fetchData";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useRouter } from "next/navigation";

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();

  function handleLogout() {
    const logout = async () => {
      const res = await fetchData("/api/users/signout", "post");
      console.log(res.data);
      if (!res.errors) {
        onLogout(); // Call the passed `onLogout` to close the dropdown
        router.push("/");
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
      Logout
    </Button>
  );
}

export default LogoutButton;
