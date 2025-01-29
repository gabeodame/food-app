"use client";

// TODO: need to be refactored to be more modular

import React, { useState, useEffect, use } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounce } from "use-debounce";
import { SearchIngredient } from "../actions/actions";

import { Ingredient } from "../types/types";
import IngredientForm from "./IngredientForm";
import { BadRequestError } from "@gogittix/common";
import sluggify from "slugify";
import { useRouter } from "next/navigation";
import CategoryForm from "./StepsForm";
import DynamicFormArray from "./DynamicFormArray";
import StepsForm from "./StepsForm";
import VerticalDragAndDrop from "./StepsForm";

// Validation schema
const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.any().optional().nullable(),
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [options, setOptions] = useState<Ingredient[]>([]);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchError, setSearchError] = useState<{
    errorMessage: string;
    index: number;
  }>({
    errorMessage: "",
    index: 0,
  });

  const router = useRouter();

  const defaultValues = {
    title: "",
    imageUrl: "",
    description: "",
    ingredients: [{ name: "", quantity: 0, unit: "" }],
    categories: [],
    tags: [],
    instructions: [],
    cuisineTypes: [],
    seasonalEvent: [],
    specialDiets: [],
  };

  const methods = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues,
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit = async (data: RecipeFormData) => {
    console.log(data);

    const formData = new FormData();
    const fileInput = data.imageUrl as unknown as FileList;
    const file = fileInput && fileInput[0];

    try {
      let imageUrl = null;
      if (file) {
        formData.append("file", file);
        formData.append("service", "userprofile"); // Specify the service name
        formData.append("entityId", sluggify(data.title, "_")); // Specify the user ID
        formData.append("fileType", "recipe-image"); // Specify the file type
      }

      const fileUploadRes = await fetch("/api/1/uploads/upload", {
        method: "POST",
        body: formData,
      });

      if (fileUploadRes.ok) {
        const resData = await fileUploadRes.json();
        imageUrl = resData?.fileUrl;
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
          console.log("Recipe created successfully");
        } else {
          throw new Error("Failed to create recipe");
        }
      }
    } catch (error) {
      throw new BadRequestError("Failed to create recipe");
    }
  };

  // Fetch ingredients when search term changes
  useEffect(() => {
    const fetchIngredients = async () => {
      // for (const index in debouncedSearchTerms) {
      //   const searchTerm = debouncedSearchTerms[index];
      if (debouncedSearchTerm.length > 3) {
        try {
          const data = await SearchIngredient(debouncedSearchTerm);
          setOptions(data);
        } catch (error) {
          console.error(
            `Error no ingredient found for ${debouncedSearchTerm}:`,
            error
          );
        }
      } else {
        setOptions([]);
      }
      // }
    };

    fetchIngredients();
  }, [debouncedSearchTerm]);

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-md space-y-6 shadow-md">
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
            Image URL
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

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium mb-1 text-color-primary">
            Ingredients
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <div className="flex space-x-2 items-start">
                {/* Name */}
                <div className="relative w-1/2">
                  <Controller
                    control={control}
                    name={`ingredients.${index}.name`}
                    render={({ field: { onChange, value } }) => (
                      <AutoComplete
                        value={value || ""}
                        options={options || []}
                        placeholder="Ingredient Name"
                        onInputChange={(newInputValue) => {
                          setSearchTerm(newInputValue);
                          onChange(newInputValue);
                          setCurrentIndex(index);
                        }}
                        onSelect={(ingredient) => {
                          onChange(ingredient.name);
                          setValue(
                            `ingredients.${index}.unit`,
                            ingredient.unit
                          );
                        }}
                      />
                    )}
                  />

                  {errors.ingredients?.[index]?.name && (
                    <p className="text-red-500 text-sm h-5">
                      {errors.ingredients[index].name?.message}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="w-1/4">
                  <input
                    type="number"
                    {...register(`ingredients.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Quantity"
                    className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
                  />
                  {errors.ingredients?.[index]?.quantity && (
                    <p className="text-red-500 text-sm h-5">
                      {errors.ingredients[index].quantity?.message}
                    </p>
                  )}
                </div>

                {/* Unit */}
                <div className="w-1/4">
                  <input
                    type="text"
                    {...register(`ingredients.${index}.unit`)}
                    placeholder="Unit"
                    className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
                  />
                  {errors.ingredients?.[index]?.unit && (
                    <p className="text-red-500 text-sm h-5">
                      {errors.ingredients[index].unit?.message}
                    </p>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-4 py-2 rounded text-white bg-color-secondary hover:bg-color-secondary-alt"
                >
                  -
                </button>

                {/* Add Button */}
                {index === fields.length - 1 && (
                  <button
                    type="button"
                    onClick={() => append({ name: "", quantity: 0, unit: "" })}
                    className="px-4 py-2 rounded text-white bg-color-primary hover:bg-color-secondary-alt"
                  >
                    +
                  </button>
                )}
              </div>
              {debouncedSearchTerm.length > 3 &&
                options.length === 0 &&
                currentIndex === index && <IngredientForm />}
            </div>
          ))}
          {/* Categories */}
          <DynamicFormArray
            label="Categories"
            fieldName="categories"
            placeholder="Category Name"
            control={control}
          />

          {/* Tags */}
          {/* Tags */}
          <DynamicFormArray
            label="Tags"
            fieldName="tags"
            placeholder="Tag Name"
            control={control}
          />

          {/* Instructions */}
          {/* <StepsForm /> */}
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
            fieldName="seasonalEvents"
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
        </div>

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

interface AutoCompleteProps {
  options: Ingredient[];
  value: string;
  placeholder?: string;
  onInputChange: (value: string) => void;
  onSelect: (ingredient: Ingredient) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  options,
  value,
  placeholder,
  onInputChange,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onInputChange(e.target.value);
          setIsOpen(true);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay closing to allow click selection
        className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
      />
      {isOpen && options.length > 0 && (
        <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-auto">
          <ul className="list-none">
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* {isOpen && options.length === 0 && (
        <div className="absolute w-full h-9 flex justify-center items-center z-10 bg-white border rounded shadow-md max-h-48 overflow-auto">
          <IngredientForm />
        </div>
      )} */}
    </div>
  );
};

// {
//     "title": "One-Pot Spanish Chicken and Potatoes",
//     "imageUrl": {
//         "0": {}
//     },
//     "description": "A flavorful dish where chicken and potatoes are simmered in a homemade tomato and olive oil sauce, infused with fresh herbs and spices.",
//     "ingredients": [
//         {
//             "name": "Chicken Breast",
//             "quantity": 1,
//             "unit": "grams"
//         },
//         {
//             "name": "Tomato",
//             "quantity": 5,
//             "unit": "grams (g)"
//         }
//     ],
//     "categories": [],
//     "tags": [],
//     "instructions": [
//         {
//             "step": "Sauce: Heat the olive oil in a large, deep skillet over medium high heat. Add the onions and garlic. Scoop the juices, seeds, and flesh out of the tomatoes into the pan. Add the eggplant pieces and simmer the mixture for 5 minutes or until everything is soupy-like and softened and very good smelling. Place the scooped out tomato halves over the sauce, open side down. Simmer for a few minutes until the tomatoes have steamed and softened. Break them up in the pan and simmer for another 5-10 minutes to get all the flavors real nice and yummy."
//         },
//         {
//             "step": "Blend: Transfer to a blender or food processor, puree until mixture reaches your desired consistency, and stir in the salt. Taste and adjust to you liki"
//         },
//         {
//             "step": "Chicken and Potatoes: In the same pan, add one more quick drizzle of olive oil and add the chicken and potato slices. Sprinkle with salt and pepper and seasoning. Saute for a few minutes on each side until they are browned."
//         },
//         {
//             "step": "Chicken and Potatoes: In the same pan, add one more quick drizzle of olive oil and add the chicken and potato slices. Sprinkle with salt and pepper and seasoning. Saute for a few minutes on each side until they are browned."
//         }
//     ],
//     "cuisineTypes": [],
//     "seasonalEvent": [],
//     "specialDiets": []
// }
