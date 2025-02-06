import Featured from "./components/Featured";
import Hero from "./components/Hero";
import AdList from "./components/ads/AdList";
import Categories from "./dishes/[id]/components/dishlist/Categories";

import ContactUs from "./components/ContactUs";
import { StickyCards } from "./components/StickyCards";

import { Metadata } from "next";
import { Suspense } from "react";
import Footer from "./components/Footer";
import DishList from "./dishes/[id]/components/DishList";

type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

export const metadata: Metadata = {
  title: "DishShare",
  description:
    "DishShare is your ultimate destination for culinary inspiration and collaboration. Explore a diverse array of mouthwatering recipes shared by food enthusiasts just like you. Whether you're craving savory dishes, decadent desserts, or delightful snacks, DishShare brings together a community of passionate cooks and foodies to share their favorite recipes and culinary creations. Join us to discover new flavors, connect with fellow food lovers, and embark on a delicious journey of exploration and sharing.",
};

export const dynamic = "force-dynamic";

export default async function MainHome({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { userList, limit } = searchParams as {
    userList: string;
    limit: string;
  };
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
            <DishList searchParams={searchParams} />
          </div>
        </div>
        <StickyCards />
        <ContactUs />
        <Footer />
      </main>
    </Suspense>
  );
}
