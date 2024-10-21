"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { SearchProvider, initialState } from "@/context/SearchContext";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Logo from "@/components/Logo";
import ModeToggle from "@/components/ui/ModeToggle";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import Search from "@/components/Search";
import CustomDialog from "@/components/widgets/CustomDialog";
import CustomSearchBar from "@/components/widgets/CustomSearchBar";
import Image from "next/image";
import CategoryMenu from "./CategoryMenu";
import { getImage } from "@/app/util/helperfunctions";
import UserAccount from "./UserAccount";
import { DropdownMenuItem } from "@/components/widgets/DropdownMenuCheckboxes";

const categories: {
  title: string;
  href: string;
  description: string;
  imageUrl: string;
}[] = [
  {
    title: "Dairy Products",
    href: "/categories/dairy-products",
    description: "Includes items like milk, cheese, butter, and yogurt.",
    imageUrl:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=4359&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Baked Goods",
    href: "/categories/baked-goods",
    description: "Bread, pastries, cakes, and other baked treats.",
    imageUrl:
      "https://images.unsplash.com/photo-1586971688390-80c62744d29e?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Fruits & Vegetables",
    href: "/categories/fruits-vegetables",
    description: "Fresh produce such as apples, oranges, spinach, and carrots.",
    imageUrl:
      "https://images.unsplash.com/photo-1700478933989-3081a48fe5a9?q=80&w=3737&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Meat & Poultry",
    href: "/categories/meat-poultry",
    description: "Chicken, beef, pork, and other meat products.",
    imageUrl:
      "https://images.unsplash.com/photo-1508615263227-c5d58c1e5821?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Seafood",
    href: "/categories/seafood",
    description: "Fish, shrimp, crab, and other seafood items.",
    imageUrl:
      "https://images.unsplash.com/photo-1608135227059-95aacee01035?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Canned & Packaged Goods",
    href: "/categories/canned-packaged-goods",
    description: "Canned vegetables, soups, and pre-packaged snacks.",
    imageUrl:
      "https://images.unsplash.com/photo-1584663639349-9398e7387244?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Grains & Cereals",
    href: "/categories/grains-cereals",
    description:
      "Rice, oats, wheat, and other grains, as well as breakfast cereals.",
    imageUrl:
      "https://images.unsplash.com/photo-1503382913214-dd83c8300c63?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Condiments & Spices",
    href: "/categories/condiments-spices",
    description: "Sauces, dressings, seasonings, and spices.",
    imageUrl:
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=3569&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Beverages",
    href: "/categories/beverages",
    description: "Non-alcoholic drinks such as juice, tea, coffee, and soda.",
    imageUrl:
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=3569&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Frozen Foods",
    href: "/categories/frozen-foods",
    description: "Frozen vegetables, meats, meals, and desserts.",
    imageUrl:
      "https://images.unsplash.com/photo-1614802104805-c884cf10f6f9?q=80&w=2561&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const items: DropdownMenuItem[] = [
  {
    label: "Status Bar",
    defaultChecked: true,
  },
  {
    label: "Activity Bar",
    defaultChecked: false,
    disabled: true,
  },
  {
    label: "Panel",
    defaultChecked: false,
  },
];

function TopNavBar() {
  const [isSticky, setIsSticky] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState();
  const foodListListUrl =
    "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0); // Simple check, adjust as needed
    };

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect(() => {
  //   const getDataUrl = async () => {
  //     const image = await getImage(foodListListUrl);
  //     setImageDataUrl(image);
  //   };

  //   getDataUrl();
  // }, [foodListListUrl]);

  return (
    <div
      className={cn("w-full h-16  sticky top-0 z-50", {
        "bg-slate-100 dark:bg-muted dark:border dark:border-b-2 dark:border-gray-800 ":
          isSticky,
      })}
    >
      <div className="w-full flex items-center justify-between container">
        <Logo />
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg">
                  Recipes & Menus
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-4 p-4 md:w-[600px] lg:w-[800px] lg:grid-cols-[1.65fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/foods"
                        >
                          <div className="h-full w-full">
                            <Image
                              src={foodListListUrl}
                              alt="Food display as icon"
                              width="0"
                              height="0"
                              sizes="100vw"
                              className="w-full h-auto rounded-md overflow-hidden"
                              priority
                              // placeholder="blur"
                              // blurDataURL={imageDataUrl}
                            />
                          </div>
                          <div className="mt-4 text-lg font-medium">
                            All Recipes
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Browse the entire list of food creations curated
                            over time by our artistic community.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/breakfast-recipes" title="Breakfast">
                      <div className="flex flex-col gap-2">
                        <div className="w-full rounded-sm shadow-sm overflow-hidden">
                          <Image
                            src="https://images.unsplash.com/photo-1604882356682-8ec3d3037c82?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="w-full h-auto rounded-md"
                            priority
                            alt="Breakfast image"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Start your day right with delicious breakfast ideas
                          and recipes.
                        </p>
                      </div>
                    </ListItem>
                    <ListItem href="/lunch-recipes" title="Lunch">
                      <div className="flex flex-col gap-2">
                        <div className="w-full rounded-sm shadow-sm overflow-hidden">
                          <Image
                            src="https://images.unsplash.com/photo-1505207957430-0378f105b2ba?q=80&w=4032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="w-full h-auto rounded-md"
                            priority
                            alt="Lunch image"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Discover satisfying lunch options to keep you
                          energized all afternoon.
                        </p>
                      </div>
                    </ListItem>
                    <ListItem href="/dinner-recipes" title="Dinner">
                      <div className="flex flex-col gap-2">
                        <div className="w-full rounded-sm shadow-sm overflow-hidden">
                          <Image
                            src="https://images.unsplash.com/photo-1653418621896-50e12c0f289b?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="w-full h-auto rounded-md"
                            priority
                            alt="Dinner image"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Explore our dinner menu for a perfect end to your day
                          with hearty meals.
                        </p>
                      </div>
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="text-lg">
                <Link href="/vendors" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="text-xl">Blog</div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {categories.map((category) => (
                      <React.Fragment key={category.title}>
                        <CategoryMenu category={category} />
                      </React.Fragment>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="text-lg">
                <Link href="/vendors" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="text-xl">Vendors</div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="text-lg">
                <Link href="/vendors" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="text-xl">Events & Promotions</div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-full">
            <React.Suspense fallback={<p>Loading...</p>}>
              <CustomSearchBar />
            </React.Suspense>
          </div>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <HamburgerMenuIcon className="md:hidden w-8 h-8 text-gray-500" />
        </div>
        <UserAccount items={items} />
      </div>
    </div>
  );
}

export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default TopNavBar;
