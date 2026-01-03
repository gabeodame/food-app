import React, { useState, useEffect, useCallback } from "react";
import { useFieldArray, Control, Controller } from "react-hook-form";
import { SearchIngredient, AddNewIngredient } from "../actions/actions";
import { useDebounce } from "use-debounce";
import CustomDialog from "@/components/widgets/CustomDialog";
import { AutoComplete } from "../components/AutoComplete";
import AddIngredientForm from "./AddIngredientForm";
import { Pencil, Trash } from "lucide-react";
import UnitSelector from "./UnitSelector";
import { Ingredient } from "../types/types";
import { cn } from "@/lib/utils";

interface IngredientsFormProps {
  control: Control<any>;
  errors: any;
  setValue: any;
  watch: any;
  getValues: any;
}

const IngredientsForm = ({
  control,
  errors,
  setValue,
  watch,
  getValues,
}: IngredientsFormProps) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "ingredients",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [showQuantityFields, setShowQuantityFields] = useState(false);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [options, setOptions] = useState<Ingredient[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const data = watch("ingredients");
  console.log("data ---from ingredients", data);

  const { setError } = control;

  // Store temporary state for editing
  const [editedIngredient, setEditedIngredient] = useState<{
    quantity?: number;
    unit?: string;
  }>({});

  const fetchIngredients = useCallback(async (query: string) => {
    if (query.length > 2) {
      try {
        const data = await SearchIngredient(query);
        setOptions(data);
        setShowAddPrompt(data.length === 0);

        // ✅ If ingredient was found, don't reset quantity fields
        // if (getValues("selectedIngredient")) {
        //   setShowQuantityFields(data.length > 0);
        // }
      } catch (error) {
        console.error(`Error fetching ingredients:`, error);
        setOptions([]);
        setShowAddPrompt(true);
        setShowQuantityFields(false);
      }
    } else {
      setOptions([]);
      setShowAddPrompt(false);

      // ✅ Keep quantity fields visible if an ingredient was already selected
      if (!getValues("selectedIngredient")) {
        setShowQuantityFields(false);
      }
    }
  }, [getValues]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 2) {
      fetchIngredients(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, fetchIngredients]);

  // Handle new ingredient addition from modal form
  const handleAddIngredient = async (ingredient: Ingredient) => {
    try {
      const res = await AddNewIngredient(ingredient);
      if (res.error) {
        console.error("Failed to add new ingredient:", res.error);
        return;
      }

      // console.log("New ingredient added:", res);

      // ✅ Close modal & clear search
      setOpenModal(false);
      setSearchTerm("");

      // ✅ Persist selected ingredient in the form state
      setValue("selectedIngredient", res);
      setValue("newIngredient", res.name);
      setValue("ingredientUnit", res.unit ?? "", {
        shouldDirty: true,
        shouldValidate: true,
      });

      // ✅ Keep quantity field visible after adding a new ingredient
      setShowQuantityFields(true);
    } catch (error: any) {
      console.error("Error adding new ingredient: ", error);
    }
  };

  // console.log("show quantity field", showQuantityFields);

  const handleUpdateIngredient = (index: number) => {
    const existingIngredient = fields[index] as Partial<
      Ingredient & { quantity?: number }
    >;

    const updatedData: Partial<Ingredient & { quantity?: number }> = {
      ...existingIngredient,
      quantity:
        editedIngredient.quantity ?? Number(existingIngredient.quantity) ?? 0,
      unit: editedIngredient.unit ?? existingIngredient.unit ?? "",
    };

    // console.log("updated ingredient", updatedData);

    update(index, updatedData); // Update the ingredient in the form state
    setEditingIndex(null); // Exit edit mode
    setEditedIngredient({}); // Reset temp state
    setShowAddPrompt(false);
  };

  const handleUnitSelection = (unit: string) => {
    console.log("Selected unit:", unit);
    setEditedIngredient((prev) => ({ ...prev, unit }));
  };

  return (
    <div>
      <label className="w-full block text-sm font-medium mb-2 text-color-primary">
        Ingredients
      </label>

      {/* Display added ingredients as pills */}
      {/* Display added ingredients as pills */}
      <div className="w-full flex flex-wrap gap-2 mb-3">
        {fields.map(
          (field: Partial<Ingredient & { quantity: number }>, index) => {
            console.log("field", field);
            return (
              <div
                key={field.id}
                className={cn(
                  "flex items-center  text-white px-4 py-2  text-sm shadow-sm transition-all",
                  editingIndex === index
                    ? "bg-gray-300 border border-gray-400 rounded"
                    : "bg-color-secondary rounded-full"
                )}
              >
                {editingIndex === index ? (
                  <div className="flex items-center gap-3">
                    {/* Quantity Input */}
                    <span className="font-semibold">{field.name}</span>
                    <input
                      type="number"
                      step={0.1}
                      value={editedIngredient.quantity ?? field.quantity}
                      onChange={(e) =>
                        setEditedIngredient((prev) => ({
                          ...prev,
                          quantity: Number(e.target.value),
                        }))
                      }
                      placeholder="Qty"
                      className="w-16 p-2 bg-color-secondary-light text-white rounded border focus:outline-none"
                    />

                    {/* Unit Selector */}
                    <Controller
                      control={control}
                      name={`ingredients.${index}.unit`}
                      render={({ field }) => (
                        <UnitSelector
                          control={control}
                          name={field.name}
                          onSelection={handleUnitSelection}
                          setValue={setValue}
                          getValues={getValues}
                        />
                      )}
                    />

                    {/* Save Button */}
                    <button
                      type="button"
                      onClick={() => handleUpdateIngredient(index)}
                      className="text-green-600 hover:text-green-800 transition-all"
                    >
                      ✔
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{field.name}</span>
                    <span className="text-white">{field.quantity}</span>
                    <span className="text-white font-medium">{field.unit}</span>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => setEditingIndex(index)}
                      className="ml-2 text-color-primary hover:text-color-primary-alt transition-all"
                    >
                      <Pencil size={14} />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-2 text-red-600 hover:text-red-800 transition-all"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* Ingredient Name Search */}
      <div className="relative w-full mb-2">
        <Controller
          control={control}
          name="newIngredient"
          render={({ field: { onChange, value } }) => (
            <AutoComplete
              value={value || ""}
              options={options || []}
              placeholder="Search for an ingredient"
              onInputChange={(newValue) => {
                onChange(newValue);
                setSearchTerm(newValue);
              }}
              onSelect={(ingredient) => {
                setValue("selectedIngredient", ingredient);
                setValue("newIngredient", ingredient.name);
                setValue("ingredientUnit", ingredient.unit);
                setShowQuantityFields(true);
                setSearchTerm("");
              }}
            />
          )}
        />
        {showQuantityFields && (
          <div className="w-full flex items-center gap-4 p-2 rounded-lg shadow-sm">
            {/* Quantity Input */}
            <div className="flex flex-col">
              <label
                htmlFor="ingredientQuantity"
                className="text-sm font-medium"
              >
                Quantity
              </label>
              <Controller
                control={control}
                name="ingredientQuantity"
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    step={0.1}
                    placeholder="Enter quantity"
                    className="w-24 p-2 bg-color-secondary-light rounded border focus:outline-none"
                  />
                )}
              />
            </div>

            {/* Unit Selector */}
            <div className="flex flex-col">
              {/* <label htmlFor="ingredientUnit" className="text-sm font-medium">
                Unit
              </label> */}
              <Controller
                control={control}
                name="ingredientUnit"
                render={({ field }) => (
                  <UnitSelector
                    control={control}
                    name={field.name}
                    setValue={setValue}
                    getValues={getValues}
                  />
                )}
              />
            </div>

            {/* Add Ingredient Button */}
            <button
              type="button"
              onClick={() => {
                const formValues = getValues(); // Get all values at once to improve performance
                const {
                  selectedIngredient,
                  newIngredient,
                  ingredientUnit,
                  ingredientQuantity,
                } = formValues;

                append({
                  id: selectedIngredient?.id,
                  name: newIngredient,
                  unit: ingredientUnit,
                  quantity: Number(ingredientQuantity) || 0,
                });

                setValue("newIngredient", "");
                setValue("ingredientQuantity", "");
                setValue("ingredientUnit", "");
                setSearchTerm("");
                setShowQuantityFields(false);
                setShowAddPrompt(false);
              }}
              className="mt-6 px-4 py-2 text-white bg-color-primary hover:bg-color-primary-alt rounded flex items-center transition-all duration-200"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Show "Add New Ingredient" button when no match is found */}
      {showAddPrompt && (
        <div className="flex flex-col items-center mt-2 gap-2">
          <div className="text-red-500 text-xs">
            {`${debouncedSearchTerm} not found. Needs to be added before use`}
          </div>
          <button
            type="button"
            className="px-4 py-2 text-white bg-color-primary hover:bg-color-secondary rounded"
            onClick={() => {
              setNewIngredientName(debouncedSearchTerm);
              setOpenModal(true);
            }}
          >
            Add New Ingredient
          </button>
        </div>
      )}

      {/* Add New Ingredient Modal */}
      <CustomDialog open={openModal} setOpen={setOpenModal}>
        <AddIngredientForm
          initialName={newIngredientName}
          onSubmit={handleAddIngredient}
        />
      </CustomDialog>
    </div>
  );
};

export default IngredientsForm;
