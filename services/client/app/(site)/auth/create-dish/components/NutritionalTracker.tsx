"use client";

import { lazy, useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, Tooltip } from "recharts";
import { Control, useWatch } from "react-hook-form";

const PieChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.PieChart }))
);

type Ingredient = {
  id?: number;
  name: string;
  unit: string;
  quantity: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  allergens?: string;
};

const COLORS = [
  "#144249", // Primary Brand Color (Bold Red-Orange)
  "#f7881f", // Secondary Green (Vibrant Green for Freshness)
  "#9fab38", // Complementary Blue (For a balanced contrast)
  "#c33130", // Accent Yellow (For energy and visibility)
];

const NutritionalTracker = ({
  recipeId,
  control, // Used for watching local form state
}: {
  recipeId?: number;
  control?: Control<any>;
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(!!recipeId);
  const [error, setError] = useState<string | null>(null);

  // Watch form ingredients when in creation mode
  let formIngredients: Ingredient[] = [];
  if (control) {
    formIngredients = useWatch({ control, name: "ingredients" });
  }

  // **Fetch ingredients if recipeId exists (View Mode)**
  useEffect(() => {
    if (!recipeId) return;

    const fetchIngredients = async () => {
      try {
        const res = await fetch(`/api/1/ingredient?recipeId=${recipeId}`);
        if (!res.ok) throw new Error("Failed to fetch ingredients");
        const data = await res.json();
        setIngredients(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [recipeId]);

  // **Use local ingredients if creating a new recipe (Creation Mode)**
  // useEffect(() => {
  //   if (!recipeId && formIngredients) {
  //     setIngredients(formIngredients);
  //   }
  // }, [formIngredients, recipeId]);

  // **Calculate Nutritional Totals**
  const totals = useMemo(() => {
    const initial = { calories: 0, protein: 0, fat: 0, carbohydrates: 0 };
    return ingredients.reduce(
      (acc, ingredient) => ({
        calories: acc.calories + (ingredient.calories || 0),
        protein: acc.protein + (ingredient.protein || 0),
        fat: acc.fat + (ingredient.fat || 0),
        carbohydrates: acc.carbohydrates + (ingredient.carbohydrates || 0),
      }),
      initial
    );
  }, [ingredients]);

  // **Extract Unique Allergens**
  const allergens = useMemo(() => {
    const allergenSet = new Set<string>();
    ingredients.forEach((ingredient) => {
      ingredient.allergens
        ?.split(",")
        .map((allergen) => allergen.trim())
        .forEach((allergen) => allergen && allergenSet.add(allergen));
    });
    return Array.from(allergenSet);
  }, [ingredients]);

  // **Prepare Chart Data**
  const chartData = useMemo(
    () => [
      { name: "Calories", value: totals.calories },
      { name: "Protein", value: totals.protein },
      { name: "Fat", value: totals.fat },
      { name: "Carbohydrates", value: totals.carbohydrates },
    ],
    [totals]
  );

  if (loading)
    return <p className="text-gray-500">Loading nutrition data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-bold mb-4 text-color-primary">
        Nutritional Breakdown
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="flex justify-center">
          <PieChart width={320} height={320}>
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

        {/* Summary Data */}
        <div className="w-full space-y-4">
          <h3 className="text-lg font-semibold">Summary</h3>
          <ul className="text-gray-700 space-y-1">
            <li>
              <strong>Total Calories:</strong> {totals.calories} kcal
            </li>
            <li>
              <strong>Total Protein:</strong> {totals.protein}g
            </li>
            <li>
              <strong>Total Fat:</strong> {totals.fat}g
            </li>
            <li>
              <strong>Total Carbohydrates:</strong> {totals.carbohydrates}g
            </li>
          </ul>

          <h3 className="text-lg font-semibold">Allergens</h3>
          {allergens.length > 0 ? (
            <ul className="list-disc list-inside text-red-500 space-y-1">
              {allergens.map((allergen, index) => (
                <li key={index}>{allergen}</li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600">No allergens detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionalTracker;
