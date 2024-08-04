import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import "./index.css";

import { Separator } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import FoodCardContent from "./components/FoodCardContent";
import { FoodItemProps, FoodListTypes } from "../../models/types/types";
// import { foodData } from "../data/foodData";
// import { prisma } from "@/lib/prisma";
import { createSlug } from "@/app/util/helperfunctions";
import FoodItemDetail from "./components/FoodItemDetail";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | null };
};

export default async function FoodDetailPage({ params }: Props) {
  console.log(params);
  return (
    <div className="overflow-hidden max-h-svh mt-4">
      <FoodItemDetail id={+params.id} />
    </div>
  );
}

// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   // read route params
//   const id = +params.id;

//   // fetch data
//   const res = await fetch(`https://recipe.dev/api/1/recipes/${id}`);
//   const { data } = await res.json();

//   // optionally access and extend (rather than replace) parent metadata
//   const previousImages = (await parent).openGraph?.images || [];

//   return {
//     title: data?.title,
//     // openGraph: {
//     //   images: ["/some-specific-page-image.jpg", ...previousImages],
//     // },
//   };
// }

// export async function generateStaticParams() {
//   if (typeof window === "undefined") {
//     const res = await fetch(
//       `http://kong-kong-manager.default.svc.cluster.local/api/1/recipes`
//     );
//     const { data } = await res.json();
//     console.log(data);

//     return data.map((recipe: FoodListTypes) => {
//       const slug = createSlug(recipe.title);
//       return {
//         slug,
//       };
//     });
//   } else {
//     const res = await fetch(`https://recipe.dev/api/1/recipes`);
//     const { data } = await res.json();
//     console.log(data);

//     return data.map((recipe: FoodListTypes) => {
//       const slug = createSlug(recipe.title);
//       return {
//         slug,
//       };
//     });
//   }
// }
