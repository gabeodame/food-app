"use client";

import useUser from "@/app/hooks/useUser";
import { useEffect, useState } from "react";
import { User } from "../components/Avatar";
import { IoCreateOutline } from "react-icons/io5";
import { Separator } from "@radix-ui/themes";
import Link from "next/link";
import Header from "./components/Header";
import UpdateProfile from "./forms/UpdateProfile";

type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

function UserDashboard({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { user, isLoading, isError } = useUser();
  console.log(params);
  console.log(searchParams);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data.</div>;

  return (
    <div className="max-w-7xl p-2 md:p-4 lg:p-6 md:gap-4 md:container sm:px-2 md:px-4">
      <Header />
      <Separator className="my-4 h-[2px] bg-color-primary" />
      {searchParams.action === "update" && (
        <UpdateProfile email={user?.email} />
      )}
      {/* <h1>Welcome back {profile?.firstName}</h1> */}
      {!params.slug && <p>Here are some of your recent activities:</p>}
    </div>
  );
}

export default UserDashboard;
