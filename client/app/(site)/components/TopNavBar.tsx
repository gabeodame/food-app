"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import Logo from "@/components/Logo";
import ModeToggle from "@/components/ui/ModeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import CustomSearchBar from "@/components/widgets/CustomSearchBar";
import Image from "next/image";
import UserAccount from "../auth/components/UserAccount";
import CategoryMenu from "./CategoryMenu";
import { DropdownMenuItem } from "@/components/widgets/DropdownMenuCheckboxes";
import MobileMenu from "./MobileMenu";
import "./TopNavBar.css";
import { Button } from "@/components/ui/Button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import LogoutButton from "./LogoutButton";

interface CategoryProp {
  title: string;
  href: string;
  imageUrl: string;
  description: string;
}

const categories = [
  {
    title: "Dairy Products",
    href: "/categories/dairy-products",
    description: "Includes items like milk, cheese, butter, and yogurt.",
    imageUrl:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=4359",
  },
  {
    title: "Baked Goods",
    href: "/categories/baked-goods",
    description: "Bread, pastries, cakes, and other baked treats.",
    imageUrl:
      "https://images.unsplash.com/photo-1586971688390-80c62744d29e?q=80&w=4000",
  },
  {
    title: "Fruits & Vegetables",
    href: "/categories/fruits-vegetables",
    description: "Fresh produce such as apples, oranges, spinach, and carrots.",
    imageUrl:
      "https://images.unsplash.com/photo-1700478933989-3081a48fe5a9?q=80&w=3737",
  },
  {
    title: "Meat & Poultry",
    href: "/categories/meat-poultry",
    description: "Chicken, beef, pork, and other meat products.",
    imageUrl:
      "https://images.unsplash.com/photo-1508615263227-c5d58c1e5821?q=80&w=3024",
  },
  {
    title: "Seafood",
    href: "/categories/seafood",
    description: "Fish, shrimp, crab, and other seafood items.",
    imageUrl:
      "https://images.unsplash.com/photo-1608135227059-95aacee01035?q=80&w=3648",
  },
];

const items: DropdownMenuItem[] = [
  { label: "Status Bar", defaultChecked: true },
  { label: "Activity Bar", defaultChecked: false, disabled: true },
  { label: "Panel", defaultChecked: false },
  {
    label: "Logout",
    defaultChecked: false,
    component: (
      <div className="w-full h-full flex flex-col">
        <Separator className="my-4 h-[2px]" />
        <LogoutButton />
      </div>
    ),
  },
];

function TopNavBar() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full h-16  bg-white dark:bg-muted dark:border-b dark:border-gray-800 shadow-md flex items-center gap-4",
        { "bg-slate-100": isSticky }
      )}
    >
      <div
        className={`max-w-7xl p-2 md:p-4 lg:p-6 flex gap-2 md:gap-4 md:container justify-center items-center sm:px-2 md:px-4`} // Center on mobile, right-align on larger screens
      >
        <div className="flex-shrink-0">
          <Logo />
        </div>

        <div className="hidden md:flex flex-grow justify-center items-center NavigationMenuRoot">
          <NavigationMenu>
            <NavigationMenuList className="NavigationMenuList">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="NavigationMenuTrigger text-md">
                  Recipes & Menus
                </NavigationMenuTrigger>
                <NavigationMenuContent className="NavigationMenuContent">
                  <ul className="grid gap-4 p-4 sm:w-[320px] md:w-[600px] lg:w-[800px] lg:grid-cols-[1.65fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/foods"
                          className="flex flex-col w-full h-full p-6 bg-gradient-to-b from-muted/50 to-muted rounded-md select-none no-underline focus:shadow-md"
                        >
                          <div className="w-full h-full">
                            <Image
                              src="https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=2000"
                              alt="Food display as icon"
                              width="0"
                              height="0"
                              sizes="100vw"
                              className="w-full h-auto rounded-md overflow-hidden"
                            />
                          </div>
                          <div className="mt-4 text-lg font-medium">
                            All Recipes
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Browse the entire list of curated food creations.
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

              <NavigationMenuItem>
                <NavigationMenuTrigger className="NavigationMenuTrigger text-md">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent className="NavigationMenuContent">
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => (
                      <React.Fragment key={category.title}>
                        <CategoryMenu category={category} />
                      </React.Fragment>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/vendors" passHref legacyBehavior>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="text-md">Blog</div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/vendors" passHref legacyBehavior>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="text-md">Vendors</div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex-1 flex items-center gap-4 justify-end">
          {/* Custom Search Bar */}
          <div className="flex-grow max-w-full md:max-w-[300px] lg:max-w-full">
            <React.Suspense fallback={<p>Loading...</p>}>
              <CustomSearchBar />
            </React.Suspense>
          </div>

          {/* Mode Toggle - Visible only on large screens */}
          <div className="hidden md:flex items-center">
            <ModeToggle />
          </div>

          {/* User Account - Visible only on large screens */}
          <div className="hidden md:block">
            <UserAccount items={items} />
          </div>

          {/* Mobile Menu - Visible only on small screens */}
          <div className="block md:hidden justify-end">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

// Reverted ListItem Component for flexible usage
export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none p-3 rounded-md leading-none no-underline transition-colors hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      >
        {/* <div className="text-sm font-medium leading-none">{title}</div> */}
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
));

ListItem.displayName = "ListItem";

export default TopNavBar;
