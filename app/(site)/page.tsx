import Image from "next/image";
import Hero from "./components/Hero";
import Container from "./components/ui/Container";
import FoodList from "./components/FoodList/FoodList";
import Categories from "./components/FoodList/Categories";
import Featured from "./components/Featured";
import AdList from "./components/ads/AdList";
import { FoodItemProps } from "./models/types/types";

export const foodData: FoodItemProps[] = [
  {
    id: "1",
    title: "Avocado Rolls Sushi Grande",
    imageUrl:
      "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
    category: "Sushi",
    tag: ["Avocado", "Sushi"],
  },
  {
    id: "2",
    title: "Avocado Rolls Sushi",
    imageUrl:
      "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
    category: "Sushi",
    tag: ["Avocado", "Sushi"],
  },
  {
    id: "3",
    title: "Pancake Stack",
    imageUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=3360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "For sighted users to preview content available behind a link.",
    category: "Pancakes",
    tag: ["Pancake", "Breakfast", "Brunch"],
  },
  {
    id: "4",
    title: "Yellow Spaghetti",
    imageUrl:
      "https://images.unsplash.com/photo-1579631542720-3a87824fff86?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    category: "Pasta",
    tag: ["Spaghetti", "Pasta"],
  },
  {
    id: "5",
    title: "Pasta with Tomato & Cheese",
    imageUrl:
      "https://images.unsplash.com/photo-1587206668283-c21d974993c3?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Visually or semantically separates content.",
    category: "Pasta",
    tag: ["Pasta", "Tomato", "Cheese"],
  },
  {
    id: "6",
    title: "Ravioli with Tomato Cuts",
    imageUrl:
      "https://images.unsplash.com/photo-1617474019977-0e105d1b430e?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    category: "Pasta",
    tag: ["Ravioli", "Pasta", "Tomato"],
  },
  {
    id: "7",
    title: "Alfred Pasta",
    imageUrl:
      "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    category: "Pasta",
    tag: ["Alfredo", "Pasta"],
  },
  {
    id: "8",
    title: "Pad Thai",
    imageUrl:
      "https://images.unsplash.com/photo-1637806930600-37fa8892069d?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    category: "Soup",
    tag: ["Thai", "Noodle"],
  },
  {
    id: "9",
    title: "Angus Burger",
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2097&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    category: "Dinner",
    tag: ["Pork", "Meat"],
  },
  {
    id: "10",
    title: "Curry Salmon Dinner",
    imageUrl:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    category: "Dinner",
  },
  {
    id: "11",
    title: "Steak Dinner",
    imageUrl:
      "https://images.unsplash.com/photo-1432139509613-5c4255815697?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    category: "Dinner",
    tag: ["Steak", "Beef"],
  },
  {
    id: "12",
    title: "Gourmet Hamburger",
    imageUrl:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=3183&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
    category: "Dinner",
    tag: ["Beef", "Burger"],
  },
];

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
