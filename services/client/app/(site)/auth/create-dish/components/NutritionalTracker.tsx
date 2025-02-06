"use client";

import { lazy, useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, Tooltip } from "recharts";

const PieChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.PieChart }))
);

export type Ingredient = {
  id: number;
  name: string;
  unit: string;
  quantity: number | null; // quantity of ingredient in recipe
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  allergens: string; // comma-separated allergens
};

const ingredients: Ingredient[] = [
  {
    id: 1,
    name: "Tomato",
    unit: "grams",
    quantity: 100,
    calories: 18,
    protein: 0.9,
    fat: 0.2,
    carbohydrates: 3.9,
    allergens: "",
  },
  {
    id: 2,
    name: "Cheese",
    unit: "grams",
    quantity: 50,
    calories: 402,
    protein: 25,
    fat: 33,
    carbohydrates: 1.3,
    allergens: "Milk",
  },
  {
    id: 3,
    name: "Wheat Bread",
    unit: "slice",
    quantity: 1,
    calories: 79,
    protein: 3.3,
    fat: 1,
    carbohydrates: 14,
    allergens: "Wheat, Gluten",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const NutritionalTracker = () => {
  const [isClient, setIsClient] = useState(false);

  // Ensure component renders only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const totals = useMemo(() => {
    const initial = { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
    return ingredients.reduce(
      (acc, ingredient) => ({
        calories: acc.calories + ingredient.calories,
        protein: acc.protein + ingredient.protein,
        fat: acc.fat + ingredient.fat,
        carbohydrates: acc.carbohydrates + ingredient.carbohydrates,
      }),
      initial
    );
  }, [ingredients]);

  const allergens = useMemo(() => {
    const allergenSet = new Set<string>();
    ingredients.forEach((ingredient) => {
      ingredient.allergens
        .split(",")
        .map((allergen) => allergen.trim())
        .forEach((allergen) => (!!allergen ? allergenSet.add(allergen) : null));
    });
    return Array.from(allergenSet);
  }, [ingredients]);

  const chartData = useMemo(
    () => [
      { name: "Calories", value: totals.calories },
      { name: "Protein", value: totals.protein },
      { name: "Fat", value: totals.fat },
      { name: "Carbohydrates", value: totals.carbohydrates },
    ],
    [totals]
  );

  if (!isClient) return null; // Ensure it doesn't render on the server

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-4">Nutritional Breakdown</h2>

      {/* Pie Chart */}
      <div className="flex justify-center mb-6">
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Insights */}
      <div>
        <h3 className="text-lg font-semibold">Summary</h3>
        <ul className="mt-2 mb-4 ">
          <li>Total Calories: {totals.calories}</li>
          <li>Total Protein: {totals.protein}g</li>
          <li>Total Fat: {totals.fat}g</li>
          <li>Total Carbohydrates: {totals.carbohydrates}g</li>
        </ul>

        <h3 className="text-lg font-semibold">Allergens</h3>
        {allergens.length > 0 ? (
          <ul className="list-disc list-inside mt-2 flex gap-2">
            {allergens.map((allergen, index) => (
              <li key={index} className="text-red-500 font-medium">
                {allergen}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600 mt-2">No allergens detected.</p>
        )}
      </div>
    </div>
  );
};

export default NutritionalTracker;
