"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounce } from "use-debounce";
import { SearchIngredient } from "../actions/actions";
import { Ingredient } from "../types/types";
import { BadRequestError } from "@gogittix/common";
import sluggify from "slugify";
import { useRouter } from "next/navigation";

import IngredientForm from "./IngredientForm";

import StepsForm from "./StepsForm";
import DynamicFormArray from "./DynamicFormArray";
import CustomDialog from "@/components/widgets/CustomDialog";
import IngredientsForm from "./IngredientForm";
import Image from "next/image";
import {
  formatUpdatePayload,
  processImageUpload,
} from "./util/formHelperfunctions";

// Validation schema for recipe
const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.any().optional().nullable(),
  description: z.string().min(1, "Description is required"),
  ingredients: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, "Ingredient name is required"),
      quantity: z
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

  // Initialize form with validation
  let {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<RecipeFormData>({
    // resolver: zodResolver(recipeSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    console.log("Submitting form data:", data);

    // ✅ Remove unnecessary fields
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

    // ✅ Handle Image Upload
    cleanData.imageUrl = await processImageUpload(
      data.imageUrl,
      existingImageUrl as string
    );

    // ✅ If updating, perform cleanup & duplicate checking
    if (recipeId) {
      cleanData = formatUpdatePayload(cleanData);
    }

    // ✅ Define API request details
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

  useEffect(() => {
    if (errors) {
      console.log("Errors:", errors);
    }
  }, [errors]);

  // **Fetch existing recipe if `recipeId` exists (edit mode)**
  useEffect(() => {
    if (recipeId) {
      const fetchRecipe = async () => {
        const res = await fetch(`/api/1/recipes/${recipeId}`);
        if (res.ok) {
          const data = await res.json();
          reset(data); // Prefill form
          setExistingImageUrl(data.imageUrl); // Save existing image
        }
      };
      fetchRecipe();
    }
  }, [recipeId, reset]);

  return (
    <div className="w-full  p-6 rounded-md space-y-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-color-primary">
        {recipeId ? "Edit Recipe" : "Create Recipe"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium mb-1 text-color-primary">
            Image
          </label>
          <input
            type="file"
            {...register("imageUrl")}
            className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
          />
          {existingImageUrl && (
            <Image
              src={existingImageUrl}
              alt={getValues("title")}
              className="w-full h-auto object-cover"
              layout="responsive"
              sizes="(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw"
              width={300}
              height={300}
            />
          )}
          {errors?.imageUrl && (
            <p className="text-red-500 text-sm h-5">
              {errors.imageUrl.message as string}
            </p>
          )}
        </div>

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

        {/* Ingredients Form Component */}
        <IngredientsForm
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
          getValues={getValues}
          // onSubmit={handleIngredientAdd}
        />

        {/* Instructions */}
        <StepsForm control={control} />

        {/* Categories */}
        <DynamicFormArray
          label="Categories"
          fieldName="categories"
          placeholder="Category Name"
          control={control}
        />

        {/* Tags */}
        <DynamicFormArray
          label="Tags"
          fieldName="tags"
          placeholder="Tag Name"
          control={control}
        />

        {/* Cuisine Types */}
        <DynamicFormArray
          label="Cuisine Types"
          fieldName="cuisineTypes"
          placeholder="Cuisine Type"
          control={control}
        />

        {/* Seasonal Events */}
        <DynamicFormArray
          label="Seasonal Events"
          fieldName="seasonalEvent"
          placeholder="Seasonal Event"
          control={control}
        />

        {/* Special Diets */}
        <DynamicFormArray
          label="Special Diets"
          fieldName="specialDiets"
          placeholder="Special Diet"
          control={control}
        />

        {/* Submit Button */}
        <div className="w-full flex justify-center items-center">
          <button
            type="submit"
            className="bg-color-primary text-white px-4 py-2 rounded"
          >
            {recipeId ? "Update Recipe" : "Create Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRecipeForm;
