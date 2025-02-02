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
  categories: z.array(
    z.object({ name: z.string().min(1, "Category name is required") })
  ),
  tags: z.array(z.object({ name: z.string().min(1, "Tag name is required") })),
  instructions: z.array(
    z.object({ step: z.string().min(1, "Instruction step is required") })
  ),
  cuisineTypes: z.array(
    z.object({ name: z.string().min(1, "Cuisine type is required") })
  ),
  seasonalEvent: z.array(
    z.object({ name: z.string().min(1, "Seasonal event is required") })
  ),
  specialDiets: z.array(
    z.object({ name: z.string().min(1, "Special diet is required") })
  ),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

const NewRecipeForm = () => {
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
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: RecipeFormData) => {
    console.log("Submitting form data..............");
    console.log("Form data:", data);

    const formData = new FormData();
    const fileInput = data.imageUrl as unknown as FileList;
    const file = fileInput && fileInput[0];

    try {
      let imageUrl = null;
      if (file) {
        formData.append("file", file);
        formData.append("service", "userprofile"); // Specify service
        formData.append("entityId", sluggify(data.title, "_")); // Use title slug as entityId
        formData.append("fileType", "recipe-image"); // Define file type
        // formData.append("slug", sluggify(data.title, "_")); // Define slug
      }

      const fileUploadRes = await fetch("/api/1/uploads/upload", {
        method: "POST",
        body: formData,
      });

      if (fileUploadRes.ok) {
        const resData = await fileUploadRes.json();
        imageUrl = resData?.fileUrl;
      }

      // Submit recipe data to API
      const res = await fetch("/api/1/recipes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          imageUrl,
        }),
      });

      if (res.ok) {
        router.push("/auth/dashboard");
      } else {
        console.error("Failed to create recipe", res.status);
      }
    } catch (error: any) {
      console.error("Error creating recipe:", error);
    }
  };

  console.log("Errors:", errors);

  return (
    <div className="w-full  p-6 rounded-md space-y-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-color-primary">
        Create Recipe
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
          // onSubmit={handleIngredientAdd}
        />

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

        {/* Instructions */}
        <StepsForm control={control} />

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
        <button
          type="submit"
          className="bg-color-primary text-white px-4 py-2 rounded"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
};

export default NewRecipeForm;
