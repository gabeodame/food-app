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
    imageUrl: "/images/jollof.png",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Fried Rice",
    imageUrl: "/images/fried_rice.png",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Shish Kebab",
    imageUrl: "/images/kekabs.png",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Acheke",
    imageUrl: "/images/acheke.png",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Kelewele",
    imageUrl: "/images/kelewele.png",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    category: "Soups",
    imageUrl: "/images/soup.png",
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
