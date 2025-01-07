import { buildClient } from "@/app/util/buildClient";
import { cookies, headers } from "next/headers";
import FoodList from "../components/FoodList/FoodList";

type Props = {
  searchParams: { [key: string]: string | string[] | null };
};

export default async function FoodListHome({ searchParams }: Props) {
  console.log("FoodListHome component is rendering...");
  console.log("SearchParams received:", searchParams);

  const category = searchParams?.category as string | undefined;
  console.log("Category:", category);

  try {
    const client = buildClient();
    console.log("Client built successfully:", client);

    const url = category
      ? `/api/1/recipes/?category=${category}`
      : `/api/1/recipes`;
    console.log("URL to fetch data:", url);

    const res = await client.get(url);
    // console.log("Response received:", res);

    if (!res?.data) {
      console.log("No data found.");
      return (
        <section>
          <div className="w-full h-full flex justify-center mt-4">
            <p>No food items found.</p>
          </div>
        </section>
      );
    }

    return (
      <section>
        <div className="w-full md:container px-4 md:px-0 mt-4">
          <FoodList foodData={res.data} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching food items:", error);
    return (
      <section>
        <div className="w-full h-full flex justify-center mt-4">
          <p>Failed to load food items.</p>
        </div>
      </section>
    );
  }
}
