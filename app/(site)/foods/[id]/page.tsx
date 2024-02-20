import Image from "next/image";

import "./index.css";
import { foodData } from "../../page";
import { Separator } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function FoodDetailPage({
  params,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = params.id;
  const item = foodData.find((item) => item.id === id);

  return (
    <div className="">
      <div className="container custom-min-height flex gap-4 flex-col items-center justify-center ">
        <Link className="container h-fit w-full flex justify-end" href="/foods">
          <div className="flex w-fit items-center justify-center gap-2 px-2 p-y-2 text-white text-sm font-bold bg-color-secondary rounded-sm cursor-pointer">
            <ArrowLeftIcon className="h-4 w-4" /> Back to All
          </div>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px] overflow-hidden items-center shadow-md border-[1px] border-gray-100 ">
          <div className="overflow-hidden rounded-md border-r-[2px] border-gray-200">
            <Image
              src={item?.imageUrl ?? ""}
              alt={item?.title ?? ""}
              width="0"
              height="0"
              sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
              className="w-full h-auto overflow-hidden rounded-md"
            />
          </div>
          <div className="to-blue-200">
            <div className="flex flex-col w-full items-center gap-3 p-5">
              <div className="w-full h-full">
                <p className="font-bold text-xl text-gray-600">{item?.title}</p>
                <Separator my="3" size="4" color="blue" />
              </div>
              <div className="w-full flex gap-2 items-center text-sm  text-center">
                <span className="text-center text-gray-500"> Category(s):</span>
                <ul className="text-center text-gray-500">
                  {Array.isArray(item?.category)
                    ? item.category.map((item) => <li key={item}>{item}</li>)
                    : item?.category}
                </ul>
              </div>
              <div className="">
                <p className=" text-gray-500">{item?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
