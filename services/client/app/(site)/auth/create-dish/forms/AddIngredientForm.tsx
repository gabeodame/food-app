"use client";

import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Ingredient } from "../types/types";
import { units } from "../schema/units";

interface IngredientFormProps {
  initialName: string;
  onSubmit: (ingredient: Ingredient) => Promise<void>;
}

const AddIngredientForm = ({
  initialName = "",
  onSubmit,
}: IngredientFormProps) => {
  const [system, setSystem] = useState<"metric" | "imperial">("metric");

  const { register, handleSubmit, control, reset, watch, setValue } =
    useForm<Ingredient>({
      defaultValues: {
        name: initialName,
        category: "",
        unit: "",
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        allergens: "",
      },
    });

  const handleFormSubmit = async (data: Ingredient) => {
    await onSubmit(data);
    reset();
  };

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Create Ingredient</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name */}
        <div className="flex flex-col">
          <label htmlFor="name">Ingredient Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="p-2 border rounded"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category">Category</label>
          <input
            {...register("category", { required: "Category is required" })}
            className="p-2 border rounded"
          />
        </div>

        {/* Unit System Selector
        <div className="flex flex-col">
          <label htmlFor="unit-system">Unit System</label>
          <select
            id="unit-system"
            value={system}
            onChange={(e) => setSystem(e.target.value as "metric" | "imperial")}
            className="p-2 border rounded"
          >
            <option value="metric">Metric</option>
            <option value="imperial">Imperial</option>
          </select>
        </div>

        {/* Unit Selection - Updates based on System */}
        {/* <div className="flex flex-col">
          <label htmlFor="unit">Unit</label>
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <select {...field} className="p-2 border rounded">
                {unitOptions[system].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            )}
          />
        </div>  */}

        {/* Nutritional Info */}
        {["calories", "protein", "fat", "carbohydrates"].map((field) => (
          <div key={field} className="flex flex-col">
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="number"
              step={0.1}
              {...register(field as keyof Ingredient, { valueAsNumber: true })}
              className="p-2 border rounded"
            />
          </div>
        ))}

        {/* Allergens */}
        <div className="flex flex-col">
          <label htmlFor="allergens">Allergens</label>
          <input {...register("allergens")} className="p-2 border rounded" />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded"
          onClick={handleSubmit(handleFormSubmit)}
        >
          Add Ingredient
        </button>
      </form>
    </div>
  );
};

export default AddIngredientForm;
