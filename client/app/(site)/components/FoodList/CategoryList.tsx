import React from "react";

import CategoryItem from "./CategoryItem";

type FoodCategory = {
  category: string;
  imageUrl: string;
  description: string;
};

const foodCategories: FoodCategory[] = [
  {
    category: "Jollof Rice",
    imageUrl:
      "https://images.unsplash.com/photo-1664993101841-036f189719b6?q=80&w=4480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Fried Rice",
    imageUrl:
      "https://images.unsplash.com/photo-1512058556646-c4da40fba323?q=80&w=3130&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Shish Kebab",
    imageUrl:
      "https://images.unsplash.com/photo-1581299893528-b2d0a61b9d48?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Acheke",
    imageUrl:
      "https://images.unsplash.com/photo-1626901148200-0e934140a02b?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Sandwiches",
    imageUrl:
      "https://images.unsplash.com/photo-1598955443263-0ad464065feb?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Soups",
    imageUrl:
      "https://images.unsplash.com/photo-1571167366136-b57e07761625?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
];

function CategoryList() {
  return (
    <div className="w-screen h-full flex flex-nowrap ">
      {foodCategories.map((food, idx) => {
        // console.log(food);
        // if (idx > 3) {
        //   return null;
        // }
        return <CategoryItem key={idx} food={food} />;
      })}
    </div>
  );
}

export default CategoryList;
