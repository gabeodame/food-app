import { getUserRecipes } from "@/app/(site)/auth/actions/getUserRecipes";
import { buildClient } from "@/app/util/buildClient";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";
import { DishListTypes } from "../../../models/types/types";
import DishItem from "./DishItem";

type SearchParams = { [key: string]: string | string[] | undefined };

async function DishList({
  limit,
  userList,
  searchParams,
}: {
  limit?: string;
  userList?: string;
  searchParams: SearchParams;
}) {
  const params = new URLSearchParams(searchParams as Record<string, string>);

  let data: DishListTypes[] = [];

  try {
    if (userList) {
      // ✅ Fetch only user-created recipes
      data = await getUserRecipes();
    } else {
      const client = buildClient();

      // ✅ Extract valid search parameters
      const validKeys = ["slug", "category", "ingredientName"];
      const filteredParams = new URLSearchParams();
      validKeys.forEach((key) => {
        if (params.has(key)) {
          filteredParams.set(key, params.get(key)!);
        }
      });

      // ✅ If no search params exist, fetch ALL recipes
      const apiEndpoint =
        filteredParams.toString().length > 0
          ? `/api/1/recipes/search?${filteredParams.toString()}`
          : `/api/1/recipes`;

      const res = await client.get(apiEndpoint);

      if (res.status === 200) {
        data = res.data;
      }
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
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
          {data.length > 0 ? (
            data
              .slice(0, limit ? Number(limit) : data.length)
              .map((item: DishListTypes, index: number) => (
                <DishItem key={index} item={item} />
              ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No recipes found.
            </p>
          )}
        </div>
      </div>
    </Suspense>
  );
}

export default DishList;
