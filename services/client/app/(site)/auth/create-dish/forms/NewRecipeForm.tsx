"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  formatUpdatePayload,
  processImageUpload,
} from "./util/formHelperfunctions";

import IngredientsForm from "./IngredientForm";
import StepsForm from "./StepsForm";
import DynamicFormArray from "./DynamicFormArray";
import NutritionalTracker from "../components/NutritionalTracker";

// Define validation schema
const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.any().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  ingredients: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, "Ingredient name is required"),
      quantity: z
        .coerce
        .number({ invalid_type_error: "Quantity must be a number" })
        .positive("Quantity must be positive"),
      unit: z.string().min(1, "Unit is required"),
    })
  ),
  categories: z.array(z.object({ name: z.string() })),
  tags: z.array(z.object({ name: z.string() })),
  instructions: z.array(
    z.object({ step: z.string().min(1, "Instruction step is required") })
  ),
  cuisineTypes: z.array(z.object({ name: z.string() })),
  seasonalEvent: z.array(z.object({ name: z.string() })),
  specialDiets: z.array(z.object({ name: z.string() })),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

const NewRecipeForm = ({ recipeId }: { recipeId?: string }) => {
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const router = useRouter();

  const defaultValues = {
    title: "",
    imageUrl: "",
    description: "",
    ingredients: [],
    categories: [],
    tags: [],
    instructions: [],
    cuisineTypes: [],
    seasonalEvent: [],
    specialDiets: [],
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (recipeId) {
      const fetchRecipe = async () => {
        const res = await fetch(`/api/1/recipes/${recipeId}`);
        if (res.ok) {
          const data = await res.json();
          reset(data); // Prefill form
          setExistingImageUrl(data.imageUrl); // Store existing image
        }
      };
      fetchRecipe();
    }
  }, [recipeId, reset]);

  const onSubmit = async (data: any) => {
    console.log("Submitting form data:", data);

    let {
      newIngredient,
      selectedIngredient,
      ingredientUnit,
      ingredientQuantity,
      id,
      slug,
      userId,
      favoritesCount,
      isFavoritedByCurrentUser,
      views,
      createdAt,
      updatedAt,
      ...cleanData
    } = data;

    cleanData.imageUrl = await processImageUpload(
      data.imageUrl,
      existingImageUrl ?? ""
    );

    if (recipeId) {
      cleanData = formatUpdatePayload(cleanData);
    }

    const method = recipeId ? "PATCH" : "POST";
    const url = recipeId ? `/api/1/recipes/${recipeId}` : `/api/1/recipes`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (res.ok) {
        router.push("/auth/dashboard");
      } else {
        console.error("Failed to save recipe", res.status);
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  return (
    <div className="w-full flex">
      <div className="w-full gap-4 p-6 rounded-md space-y-6 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-color-primary">
          {recipeId ? "Edit Recipe" : "Create Recipe"}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col gap-4"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-color-primary">
              Title
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-sm h-5">{errors.title.message}</p>
            )}
          </div>

          {/* Image Upload Toggle */}
          {existingImageUrl && !showImageUpload ? (
            <div className="flex flex-col gap-2">
              <Image
                src={existingImageUrl}
                alt={getValues("title")}
                className="w-full h-auto object-cover rounded"
                layout="responsive"
                width={300}
                height={300}
              />
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setShowImageUpload(true)}
              >
                Change Image
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1 text-color-primary">
                Upload Image
              </label>
              <input
                type="file"
                {...register("imageUrl")}
                className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-color-primary">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm h-5">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Ingredients */}
          <IngredientsForm
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            getValues={getValues}
          />

          {/* Instructions */}
          <StepsForm control={control} />

          {/* Toggle for Optional Fields */}
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showOptionalFields
              ? "Hide Optional Fields"
              : "Show Optional Fields"}
          </button>

          {/* Optional Fields */}
          {showOptionalFields && (
            <>
              <DynamicFormArray
                label="Categories"
                fieldName="categories"
                placeholder="Category Name"
                control={control}
              />
              <DynamicFormArray
                label="Tags"
                fieldName="tags"
                placeholder="Tag Name"
                control={control}
              />
              <DynamicFormArray
                label="Cuisine Types"
                fieldName="cuisineTypes"
                placeholder="Cuisine Type"
                control={control}
              />
              <DynamicFormArray
                label="Seasonal Events"
                fieldName="seasonalEvent"
                placeholder="Seasonal Event"
                control={control}
              />
              <DynamicFormArray
                label="Special Diets"
                fieldName="specialDiets"
                placeholder="Special Diet"
                control={control}
              />
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-fit bg-color-primary text-white px-4 py-2 rounded "
          >
            {recipeId ? "Update Recipe" : "Create Recipe"}
          </button>
        </form>
      </div>
      <NutritionalTracker control={control} />
    </div>
  );
};

export default NewRecipeForm;
