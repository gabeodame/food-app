import { buildClient } from "@/app/util/buildClient";
import { cookies, headers } from "next/headers";
import FoodList from "./[id]/components/DishList";
import DishList from "./[id]/components/DishList";

type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

export const dynamic = "force-dynamic";

export default async function FoodListHome({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: Params;
}) {
  return (
    <section>
      <div className="w-full md:container px-4 md:px-0 mt-4">
        <DishList searchParams={searchParams} />
      </div>
    </section>
  );
}
