"use client";

import React, { ChangeEvent, Suspense, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import IngredientForm from "./IngredientForm";
import CustomDialog from "@/components/widgets/CustomDialog";
import { Ingredient } from "../types/types";
import { BadRequestError } from "@gogittix/common";
import { useDebounce } from "use-debounce";
import { SearchIngredient } from "../actions/actions";

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
  const [options, setOptions] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

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
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const onSubmit = (data: RecipeFormData) => {
    console.log("Submitted data:", data);
  };

  const handleOnOptionSelect = (value: string) => {
    console.log("Selected option:", value);
    setSearch(value);
    setOpen(false);
  };

  useEffect(() => {
    if (debouncedSearch) {
      // Fetch ingredients based on the search query
      const fetchIngredients = async () => {
        try {
          const data = await SearchIngredient(debouncedSearch);

          console.log("Fetched ingredients:", data);
          setOptions(data);
        } catch (error: any) {
          throw new BadRequestError(
            `Error fetching ingredients: ${error.message}`
          );
        }
      };
      fetchIngredients();
    }
  }, [debouncedSearch]);

  useEffect(() => {
    !!options.length ? setOpen(true) : setOpen(false);
  }, [options]);

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-md space-y-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-color-primary">
        Create Recipe
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-color-primary">
            Title
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-2  bg-color-secondary-light rounded border focus:outline-none"
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
            type="text"
            {...register("imageUrl")}
            className="w-full p-2  bg-color-secondary-light rounded border focus:outline-none"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm h-5">
              {errors.imageUrl.message}
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
            className="w-full p-2  bg-color-secondary-light rounded border focus:outline-none"
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
            <div key={field.id} className="flex space-x-2 items-start mb-4">
              <div className="relative">
                <input
                  type="text"
                  {...register(`ingredients.${index}.name` as const)}
                  placeholder="Ingredient Name"
                  className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
                  value={search}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    console.log(e.currentTarget.value);
                    setSearch(e.currentTarget.value);
                  }}
                />
                {open && (
                  <AutoComplete
                    options={options}
                    onSelect={handleOnOptionSelect}
                  />
                )}
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
                  className="w-full p-2  bg-color-secondary-light rounded border focus:outline-none"
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
                  className="w-full p-2  bg-color-secondary-light rounded border focus:outline-none"
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
                  className="px-4 py-2 rounded text-white border border-color-secondary-alt bg-color-secondary hover:bg-color-secondary-alt hover:text-color-tertiary"
                >
                  -
                </button>
                {index === fields.length - 1 && (
                  <button
                    type="button"
                    onClick={() => append({ name: "", quantity: 0, unit: "" })}
                    className="px-4 py-2 rounded text-white bg-color-red border border-color-secondary hover:bg-color-secondary-alt hover:text-color-tertiary"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex w-full gap-4 justify-between">
          <button
            type="submit"
            className="bg-color-primary text-white px-4 py-2 rounded text-nowrap"
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

const AutoComplete = ({
  options,
  onSelect,
}: {
  options: Ingredient[];
  onSelect: (value: string) => void;
}) => {
  return (
    <div className="absolute z-10 bg-white border-color-primary-alt border border-primary-color-alt rounded shadow-md w-64 max-h-48 overflow-auto">
      <ul className="w-full p-2 list-none text-sm focus:outline-none text-color-primary bg-color-primary-light">
        {options.map((option: Ingredient) => (
          <li
            key={option.id}
            onClick={() => onSelect(option.name)}
            className="truncate text-color-primary bg-color-primary-light"
          >
            <div className="">
              {/* <span> {option.}</span> */}
              <span> {option.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
