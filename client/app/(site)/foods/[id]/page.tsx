import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import "./index.css";

import { Separator } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import FoodCardContent from "./components/FoodCardContent";
import { FoodItemProps } from "../../models/types/types";
// import { foodData } from "../data/foodData";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function FoodDetailPage({ params }: Props) {
  // const id = +params.id;
  const id = parseInt(params.id, 10);

  const found = await prisma.recipe.findFirst({
    where: {
      id: id,
    },
    include: {
      ingredients: true,
      instructions: true,
      tags: {
        select: {
          tag: {
            select: {
              name: true,
            },
          },
        },
      },
      categories: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // console.log(found, "found");

  return (
    <div className="overflow-hidden max-h-svh mt-4">
      <div className="container custom-min-height flex gap-4 flex-col items-center justify-center mt-2">
        <Link className="container h-fit w-full flex justify-end" href="/foods">
          <div className="flex w-fit items-center justify-center gap-2 px-2 p-y-2 text-white font-bold bg-color-secondary rounded-sm cursor-pointer">
            <ArrowLeftIcon className="h-4 w-4" /> Back to All
          </div>
        </Link>
        <div className="w-full h-max grid grid-cols-1 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px]  items-center shadow-md border-[1px] border-gray-100">
          <div className=" rounded-md border-r-[2px] border-gray-200">
            <Image
              src={found?.imageUrl ?? ""}
              alt={found?.title ?? ""}
              width="0"
              height="0"
              sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
              className="w-full h-auto  rounded-md"
            />
          </div>
          <FoodCardContent food={found as any} />
        </div>
      </div>
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
//   const food = await prisma.recipe.findUnique({
//     where: {
//       id,
//     },
//   });
//   // const product = await fetch(`https://.../${id}`).then((res) => res.json());

//   // optionally access and extend (rather than replace) parent metadata
//   // const previousImages = (await parent).openGraph?.images || [];

//   return {
//     title: food?.title,
//     // openGraph: {
//     //   images: ["/some-specific-page-image.jpg", ...previousImages],
//     // },
//   };
// }

// export async function generateStaticParams({ params, searchParams }: Props) {
//   const id = +params.id;
//   const food = await prisma.recipe.findUnique({
//     where: {
//       id,
//     },
//   });

//   return {
//     title: food?.title,
//   };
// }
