"use client";

import React, { Suspense } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import IngredientForm from "./IngredientForm";
import CustomDialog from "@/components/widgets/CustomDialog";

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.array(
    z.object({
      name: z.string().min(1, "Ingredient name is required"),
      quantity: z
        .number({ invalid_type_error: "Quantity must be a number" })
        .positive("Quantity must be positive"),
      unit: z.string().min(1, "Unit is required"),
    })
  ),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

const NewRecipeForm = () => {
  const [open, setOpen] = React.useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      description: "",
      ingredients: [{ name: "", quantity: 0, unit: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const onSubmit = (data: RecipeFormData) => {
    console.log("Submitted data:", data);
  };

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-4">Create Recipe</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm h-5">{errors.title.message}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            {...register("imageUrl")}
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm h-5">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm h-5">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium mb-1">Ingredients</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-2 items-start mb-4">
              <div className="w-1/3">
                <input
                  type="text"
                  {...register(`ingredients.${index}.name` as const)}
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.ingredients?.[index]?.name && (
                  <p className="text-red-500 text-sm h-5">
                    {errors.ingredients[index].name?.message}
                  </p>
                )}
              </div>

              <div className="w-1/4">
                <input
                  type="number"
                  {...register(`ingredients.${index}.quantity` as const, {
                    valueAsNumber: true, // Ensure numeric input is cast to a number
                  })}
                  placeholder="Quantity"
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.ingredients?.[index]?.quantity && (
                  <p className="text-red-500 text-sm h-5">
                    {errors.ingredients[index].quantity?.message}
                  </p>
                )}
              </div>

              <div className="w-1/4">
                <input
                  type="text"
                  {...register(`ingredients.${index}.unit` as const)}
                  placeholder="Unit"
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.ingredients?.[index]?.unit && (
                  <p className="text-red-500 text-sm h-5">
                    {errors.ingredients[index].unit?.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-white bg-red-500 px-4 py-2 rounded"
                >
                  -
                </button>
                {index === fields.length - 1 && (
                  <button
                    type="button"
                    onClick={() => append({ name: "", quantity: 0, unit: "" })}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex w-full justify-between">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded text-nowrap"
          >
            Submit Recipe
          </button>

          <div className="w-full">
            <IngredientForm />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewRecipeForm;
