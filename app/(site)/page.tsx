import Image from "next/image";
import Hero from "./components/Hero";
import Container from "./components/ui/Container";
import FoodList from "./components/FoodList/FoodList";
import Categories from "./components/FoodList/Categories";
import Featured from "./components/Featured";
import AdList from "./components/ads/AdList";
import { FoodItemProps } from "./models/types/types";
import { foodData } from "./foods/data/foodData";

export default async function MainHome() {
  return (
    <main className="w-full">
      <div className="w-full hidden md:block">
        <Hero />
      </div>
      <div className="w-full flex flex-col">
        <Categories />
        <div className="w-full hidden md:block">
          <Featured />
        </div>
        <AdList />
        <div className="container">
          <FoodList foodData={foodData} />
        </div>
      </div>
    </main>
  );
}
