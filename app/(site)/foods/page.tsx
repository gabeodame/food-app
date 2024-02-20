import FoodList from "../components/FoodList/FoodList";
import { foodData } from "../page";

export default async function FoodListHome() {
  return (
    <div className="container overflow-hidden">
      <FoodList foodData={foodData} />
    </div>
  );
}
