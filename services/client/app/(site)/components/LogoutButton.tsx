"use client";

import fetchData from "@/app/util/fetchData";
import { Button } from "@/components/ui/Button";
import React, { useTransition } from "react";

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    const logout = async () => {
      const res = await fetchData("/api/users/signout", "post");
      // console.log(res.data);
      if (!res.errors) {
        startTransition(() => {
          onLogout(); // Call the passed `onLogout` to close the dropdown
        });
      }
    };
    logout();
  }

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="w-full px-8 justify-start items-center"
      disabled={isPending}
    >
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}

export default LogoutButton;
