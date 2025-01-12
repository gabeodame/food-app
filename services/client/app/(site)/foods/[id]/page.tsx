import { buildClient } from "@/app/util/buildClient";
import FoodItemDetail from "./components/FoodItemDetail";
import NotFound from "../../not-found";

type Props = {
  params: { id: string };
};

export default async function FoodDetailPage({ params }: Props) {
  try {
    const client = buildClient();
    const res = await client.get(`/api/1/recipes/${params.id}`);

    if (res.status !== 200) {
      return (
        <div className="w-full h-full flex justify-center mt-4">
          <p>Food not found</p>
        </div>
      );
    }

    const { data } = res;

    return (
      <div className="w-full h-full overflow-y-auto flex justify-center mt-4">
        <FoodItemDetail food={data} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching food details:", error);
    NotFound();
  }
}
