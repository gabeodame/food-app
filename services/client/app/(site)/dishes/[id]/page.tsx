import { buildClient } from "@/app/util/buildClient";
import FoodItemDetail from "./components/DishItemDetail";
import { notFound } from "next/navigation";

type Params = { id: string };
type SearchParams = { [key: string]: string | string[] | undefined };

async function fetchRecipe(recipeId: number) {
  try {
    const client = buildClient();
    const res = await client.get(`/api/1/recipes/${recipeId}`);

    if (res.status !== 200) {
      return notFound();
    }

    return res.data;
  } catch (error) {
    console.error("Error fetching food details:", error);
    return null;
  }
}

// ✅ Dynamically generate metadata

export async function generateMetadata({ params }: { params: Params }) {
  const recipeId = Number(params.id);

  try {
    const client = buildClient();
    const res = await client.get(`/api/1/recipes/${recipeId}`);

    if (res.status !== 200) {
      return {
        title: "Food Not Found",
        description: "The requested food item could not be found.",
      };
    }

    const data = res.data;

    return {
      title: `${data.title} | Food Details`,
      description: data.description || "Delicious food details and recipes.",
      openGraph: {
        title: data.title,
        description: data.description || "Discover delicious food details.",
        images: [
          {
            url: data.imageUrl,
            width: 800,
            height: 600,
            alt: data.title,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching recipe metadata:", error);
    return {
      title: "Food Not Found",
      description: "The requested food item could not be found.",
    };
  }
}

export default async function FoodDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const recipeId = Number(params.id);

  const data = await fetchRecipe(recipeId);

  if (!data) {
    notFound();
  }

  return (
    <div className="w-full h-full overflow-y-auto flex justify-center mt-4">
      <FoodItemDetail dish={data} />
    </div>
  );
}

// ✅ Generate Static Params for pre-building pages
export async function generateStaticParams() {
  try {
    const client = buildClient();
    const res = await client.get("/api/1/recipes");

    if (!res.data) {
      notFound();
    }

    const recipes = await res.data;
    return recipes.map((recipe: any) => ({ id: recipe.id.toString() }));
  } catch (error) {
    console.error("Error fetching static food params:", error);
    return [];
  }
}
