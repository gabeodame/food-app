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
  searchParams = {},
  showAllLink = false,
  paginated = false,
  pageSize = 12,
}: {
  limit?: string;
  userList?: string;
  searchParams?: SearchParams;
  showAllLink?: boolean;
  paginated?: boolean;
  pageSize?: number;
}) {
  const params = new URLSearchParams();
  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (typeof value === "string") {
      params.set(key, value);
    }
  });
  const pageParam = searchParams?.page;
  const currentPage = Math.max(
    1,
    Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1
  );

  let data: DishListTypes[] = [];
  let totalPages = 0;

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
      if (paginated) {
        filteredParams.set("page", String(currentPage));
        filteredParams.set("pageSize", String(pageSize));
      }

      const hasSearchFilters = ["slug", "category", "ingredientName"].some(
        (key) => filteredParams.has(key)
      );
      const apiEndpoint = hasSearchFilters
        ? `/api/1/recipes/search?${filteredParams.toString()}`
        : paginated
        ? `/api/1/recipes?${filteredParams.toString()}`
        : `/api/1/recipes`;

      const res = await client.get(apiEndpoint);

      if (res.status === 200) {
        if (Array.isArray(res.data)) {
          data = res.data;
        } else {
          data = res.data.data ?? [];
          totalPages = res.data.totalPages ?? 0;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4">
        {/* Conditional Button */}
        {showAllLink && (
          <Link
            href="/dishes"
            className="flex gap-1 items-center justify-center md:justify-end"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Show All
          </Link>
        )}

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

        {paginated && totalPages > 1 && (
          <div className="w-full flex items-center justify-center gap-4 pt-4">
            <Link
              href={`/dishes?${new URLSearchParams({
                ...Object.fromEntries(params.entries()),
                page: String(Math.max(1, currentPage - 1)),
              }).toString()}`}
              className={`px-3 py-1 rounded-md border ${
                currentPage <= 1
                  ? "pointer-events-none text-gray-400 border-gray-200"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              aria-disabled={currentPage <= 1}
            >
              Previous
            </Link>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={`/dishes?${new URLSearchParams({
                ...Object.fromEntries(params.entries()),
                page: String(Math.min(totalPages, currentPage + 1)),
              }).toString()}`}
              className={`px-3 py-1 rounded-md border ${
                currentPage >= totalPages
                  ? "pointer-events-none text-gray-400 border-gray-200"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              aria-disabled={currentPage >= totalPages}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </Suspense>
  );
}

export default DishList;
