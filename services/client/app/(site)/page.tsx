import Featured from "./components/Featured";
import Categories from "./components/FoodList/Categories";
import FoodList from "./components/FoodList/FoodList";
import Hero from "./components/Hero";
import AdList from "./components/ads/AdList";

import LogoText from "@/components/LogoText";
import ContactUs from "./components/ContactUs";
import { StickyCards } from "./components/StickyCards";

import { Metadata } from "next";
import Footer from "./components/Footer";
import { Suspense } from "react";
import { buildClient } from "../util/buildClient";
import NotFound from "./not-found";

export const metadata: Metadata = {
  title: "DishShare",
  description:
    "DishShare is your ultimate destination for culinary inspiration and collaboration. Explore a diverse array of mouthwatering recipes shared by food enthusiasts just like you. Whether you're craving savory dishes, decadent desserts, or delightful snacks, DishShare brings together a community of passionate cooks and foodies to share their favorite recipes and culinary creations. Join us to discover new flavors, connect with fellow food lovers, and embark on a delicious journey of exploration and sharing.",
};

export default async function MainHome() {
  try {
    const client = buildClient();
    const res = await client.get("/api/1/recipes");
    const data = res.data;

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <main className="w-full flex flex-col justify-center">
          <div className="hidden md:block">
            <Hero />
          </div>
          <div className="wf-full flex flex-col justify-center">
            <Categories />
            <div className="w-full hidden md:block">
              <Featured />
            </div>
            <AdList />
            <div className="container">
              {data.length ? (
                <FoodList foodData={data} limit={4} />
              ) : (
                <div>No Recipes found</div>
              )}
            </div>
          </div>
          <StickyCards />
          <ContactUs />
          <Footer />
        </main>
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching food items:", error);
    NotFound();
  }
}
