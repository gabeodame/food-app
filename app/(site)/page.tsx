import Image from "next/image";
import Hero from "./components/Hero";
import Container from "./components/ui/Container";
import FoodList from "./components/FoodList/FoodList";
import Categories from "./components/FoodList/Categories";
import Featured from "./components/Featured";
import AdList from "./components/ads/AdList";
import { FoodItemProps } from "./models/types/types";
import { foodData } from "./foods/data/foodData";
import { StickyCards } from "./components/StickyCards";
import ContactUs from "./components/ContactUs";
import Logo from "@/components/Logo";
import LogoText from "@/components/LogoText";

export default async function MainHome() {
  return (
    <main className="w-full">
      <div className=" hidden md:block">
        <Hero />
      </div>
      <div className=" flex flex-col">
        <Categories />
        <div className="w-full hidden md:block">
          <Featured />
        </div>
        <AdList />
        <div className="container">
          <FoodList foodData={foodData} limit={4} />
        </div>
      </div>
      <StickyCards />
      <ContactUs />
      <footer className="container flex justify-between py-8 gap-8 w-full h-[258px]">
        <div className="">
          <span>
            <LogoText />
          </span>
          <div className="flex flex-col gap-4 items-start">
            <span className="">
              2972 Westheimer Rd. Santa Ana, <br />
              Illinois 85486
            </span>
            <span className="">support@example.com</span>
            <span className="font-bold text-color_primary">
              +(1) 718-222-222
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start">
          <h2 className="font-bold text-color_primary text-xl uppercase">
            Categories
          </h2>
          <div className="w-full ">
            <ul className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "American Cuisine",
                "Italine Cuisine",
                "African Cusine",
                "Asian Cuisine",
                "Indian Cuisine",
                "Other",
              ].map((cat) => (
                <li key={cat}>{cat}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start">
          <h2 className="font-bold text-color_primary text-xl uppercase">
            Parners
          </h2>
        </div>
      </footer>
    </main>
  );
}
