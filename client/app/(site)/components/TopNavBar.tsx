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

const components: {
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

function TopNavBar() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0); // Simple check, adjust as needed
    };

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
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
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/foods"
                        >
                          <div className="h-full w-full">
                            <Image
                              src="https://images.unsplash.com/photo-1704403529456-a676da0de4f0?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                              alt="Food display as icon"
                              width="0"
                              height="0"
                              sizes="100vw"
                              className="w-full h-full overflow-hidden m-0"
                            />
                          </div>
                          <div className="mb-2 mt-4 text-lg font-medium">
                            All Recipes
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Browse the entire list of food creations curated
                            over time by our artistic community
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="Introduction">
                      Breakfast Menu
                    </ListItem>
                    <ListItem href="/docs/installation" title="Installation">
                      Lunch Menu
                    </ListItem>
                    <ListItem
                      href="/docs/primitives/typography"
                      title="Typography"
                    >
                      Dinner Menu
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        // title={component.title}
                        href={component.href}
                      >
                        <div className="flex gap-2  items-center justify-center">
                          <div className="w-full h-full rounded-sm shadow-sm overflow-hidden">
                            <Image
                              src={component.imageUrl}
                              alt={component.title}
                              width="0"
                              height="0"
                              sizes="100vw"
                              className="w-full h-full overflow-hidden m-0"
                            />
                          </div>
                          <div className="flex flex-col gap-1 justify-center">
                            <span className="font-bold text-primary">
                              {component.title}
                            </span>
                            <span>{component.description}</span>
                          </div>
                        </div>
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="text-lg">
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="text-xl"> Documentation</div>
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
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
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
