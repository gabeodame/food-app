"use client";

import CustomDialog from "@/components/widgets/CustomDialog";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Ingredient } from "../types/types";

import { AddNewIngredient } from "../actions/actions";

const IngredientForm = () => {
  // Use a consistent initial state for hydration
  const [system, setSystem] = useState<"metric" | "imperial">("metric");
  const [open, setOpen] = useState(false);

  // React Hook Form setup
  const { register, handleSubmit, control, reset, watch } = useForm<Ingredient>(
    {
      defaultValues: {
        name: "",
        category: "",
        unit: "",
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        allergens: "",
      },
    }
  );

  // Handler for form submission
  const onSubmit = async (data: Ingredient) => {
    try {
      const res = await AddNewIngredient(data);
      if (res.error) {
        console.error("Failed to add new ingredient:", res.error);
      }

      reset(); // Reset the form after submission
      setOpen(false); // Close the dialog

      // Refresh the ingredient list (via a global state or context)
    } catch (error: any) {
      console.error("Error adding new ingredient:", error);
      return {
        error: error.message,
      };
    }
  };

  // Units for metric and imperial systems
  const units = useMemo(() => {
    return {
      metric: ["milliliters", "liters", "grams", "kilograms"],
      imperial: [
        "teaspoons",
        "tablespoons",
        "cups",
        "fluid ounces",
        "pounds",
        "ounces",
      ],
    };
  }, []);

  return (
    <CustomDialog
      open={open}
      setOpen={() => setOpen(!open)}
      trigger={
        <div className="flex bg-color-tertiary-alt w-fit text-white px-4 py-2 rounded self-end">
          Add New Ingredient
        </div>
      }
    >
      <div className="w-1/2 mx-auto mt-10 p-6 bg-white shadow-md rounded-lg overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Create Ingredient</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-5xl">
          {/* Ingredient Name */}
          <div className="w-full flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium">
              Ingredient Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label htmlFor="category" className="mb-1 font-medium">
              Category
            </label>
            <input
              id="category"
              type="text"
              {...register("category")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* System Toggle */}
          <div className="w-full flex flex-col">
            <label className="mb-1 font-medium">System</label>
            <div className="w-full flex space-x-4">
              <button
                type="button"
                onClick={() => setSystem("metric")}
                className={` p-2 rounded ${
                  system === "metric" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Metric
              </button>
              <button
                type="button"
                onClick={() => setSystem("imperial")}
                className={`p-2 rounded ${
                  system === "imperial"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Imperial
              </button>
            </div>
          </div>

          {/* Unit Selection */}
          <div className="flex flex-col">
            <label htmlFor="unit" className="mb-1 font-medium">
              Unit
            </label>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="unit"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Unit</option>
                  {units[system].map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Calories */}
          <div className="flex flex-col">
            <label htmlFor="calories" className="mb-1 font-medium">
              Calories
            </label>
            <input
              id="calories"
              type="number"
              step={0.1}
              {...register("calories", { valueAsNumber: true })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Protein */}
          <div className="flex flex-col">
            <label htmlFor="protein" className="mb-1 font-medium">
              Protein (g)
            </label>
            <input
              id="protein"
              type="number"
              step={0.1}
              {...register("protein", { valueAsNumber: true })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Fat */}
          <div className="flex flex-col">
            <label htmlFor="fat" className="mb-1 font-medium">
              Fat (g)
            </label>
            <input
              id="fat"
              type="number"
              step={0.1}
              {...register("fat", { valueAsNumber: true })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Carbohydrates */}
          <div className="flex flex-col">
            <label htmlFor="carbohydrates" className="mb-1 font-medium">
              Carbohydrates (g)
            </label>
            <input
              id="carbohydrates"
              type="number"
              step={0.1}
              {...register("carbohydrates", { valueAsNumber: true })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Allergens */}
          <div className="flex flex-col">
            <label htmlFor="allergens" className="mb-1 font-medium">
              Allergens
            </label>
            <input
              id="allergens"
              type="text"
              {...register("allergens")}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-color-tertiary-alt text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </CustomDialog>
  );
};

export default IngredientForm;
