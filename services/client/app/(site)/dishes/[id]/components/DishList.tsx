import { getUserRecipes } from "@/app/(site)/auth/actions/getUserRecipes";
import { buildClient } from "@/app/util/buildClient";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";
import { DishListTypes } from "../../../models/types/types";
import DishItem from "./DishItem";

async function DishList({
  limit,
  userList,
}: {
  limit?: string;
  userList?: string;
}) {
  let data: DishListTypes[] = [];
  if (userList) {
    const userRecipes = await getUserRecipes();
    data = userRecipes;
  } else {
    const client = buildClient();
    const res = await client.get("/api/1/recipes");

    data = res.data;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4">
        {/* Conditional Button */}
        <Link
          href="/dishes"
          className="flex gap-1 items-center justify-center md:justify-end"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Show All
        </Link>

        {/* Grid Layout */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4">
          {data &&
            data?.map((item: DishListTypes, index: number) => {
              if (limit && index >= Number(limit)) return null;
              return <DishItem item={item} />;
            })}
        </div>
      </div>
    </Suspense>
  );
}

export default DishList;
