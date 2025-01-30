import React, { useState, useEffect } from "react";
import { useFieldArray, Control, Controller, useForm } from "react-hook-form";
import { SearchIngredient, AddNewIngredient } from "../actions/actions";
import { useDebounce } from "use-debounce";
import CustomDialog from "@/components/widgets/CustomDialog";
import { AutoComplete } from "../components/AutoComplete";
import AddIngredientForm from "./AddIngredientForm";
import { Pencil, Trash } from "lucide-react";

export type Ingredient = {
  id?: string;
  name: string;
  category?: string;
  unit: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
  allergens?: string;
};

interface IngredientsFormProps {
  control: Control<any>;
  errors: any;
  setValue: any;
}

const IngredientsForm = ({
  control,
  errors,
  setValue,
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

  // Store temporary state for editing
  const [editedIngredient, setEditedIngredient] = useState<{
    quantity?: number;
    unit?: string;
  }>({});

  // Fetch ingredients when search term changes
  useEffect(() => {
    const fetchIngredients = async () => {
      if (debouncedSearchTerm.length > 2) {
        try {
          const data = await SearchIngredient(debouncedSearchTerm);
          setOptions(data);
          setShowAddPrompt(data.length === 0);

          // ✅ Ensure quantity fields are only toggled based on selection
          if (!control._formValues.selectedIngredient) {
            setShowQuantityFields(data.length > 0);
          }
        } catch (error) {
          console.error(`Error fetching ingredients:`, error);
          setOptions([]);
          setShowAddPrompt(true);
          setShowQuantityFields(false);
        }
      } else {
        setOptions([]);
        setShowAddPrompt(false);

        // ✅ Keep showQuantityFields true if ingredient was manually added
        if (!control._formValues.selectedIngredient) {
          setShowQuantityFields(false);
        }
      }
    };

    fetchIngredients();
  }, [debouncedSearchTerm, control]);

  // Handle new ingredient addition from modal form
  const handleAddIngredient = async (ingredient: Ingredient) => {
    try {
      const res = await AddNewIngredient(ingredient);
      if (res.error) {
        console.error("Failed to add new ingredient:", res.error);
        return;
      }

      console.log("New ingredient added:", res);

      // ✅ Close modal & clear search
      setOpenModal(false);
      setSearchTerm("");

      // ✅ Ensure unit input is fully editable
      setValue("selectedIngredient", res);
      setValue("newIngredient", res.name);
      setValue("ingredientUnit", res.unit ?? "", {
        shouldDirty: true,
        shouldValidate: true,
      });

      // ✅ Keep quantity field visible
      setShowQuantityFields(true);
    } catch (error: any) {
      console.error("Error adding new ingredient:", error);
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

    update(index, updatedData); // Update the ingredient in the form state
    setEditingIndex(null); // Exit edit mode
    setEditedIngredient({}); // Reset temp state
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-color-primary">
        Ingredients
      </label>

      {/* Display added ingredients as pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {fields.map(
          (field: Partial<Ingredient & { quantity: number }>, index) => (
            <div
              key={field.id}
              className="flex items-center bg-color-secondary text-white px-3 py-1 rounded-full text-sm"
            >
              {editingIndex === index ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editedIngredient.quantity ?? field.quantity}
                    onChange={(e) =>
                      setEditedIngredient((prev) => ({
                        ...prev,
                        quantity: Number(e.target.value),
                      }))
                    }
                    placeholder="Qty"
                    className="w-16 p-1 rounded border focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editedIngredient.unit ?? field.unit}
                    onChange={(e) =>
                      setEditedIngredient((prev) => ({
                        ...prev,
                        unit: e.target.value,
                      }))
                    }
                    placeholder="Unit"
                    className="w-16 p-1 rounded border focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdateIngredient(index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ✔
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {field.name} | {field.quantity} {field.unit}
                  <button
                    type="button"
                    onClick={() => setEditingIndex(index)}
                    className="ml-2 text-gray-200 hover:text-color-primary-alt"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              )}
            </div>
          )
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
                setValue("selectedIngredient", ingredient); // ✅ Ensure this is set
                setValue("newIngredient", ingredient.name);
                setValue("ingredientUnit", ingredient.unit);
                setShowQuantityFields(true);
              }}
            />
          )}
        />
        {showQuantityFields && (
          <div className="flex gap-2 items-center">
            <Controller
              control={control}
              name="ingredientQuantity"
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Quantity"
                  value={control._formValues.ingredientQuantity}
                  className="w-20 p-2 rounded border focus:outline-none"
                />
              )}
            />
            <Controller
              control={control}
              name="ingredientUnit"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Unit"
                  // disabled
                  value={control._formValues.selectedIngredient?.unit}
                  className="w-20 p-2 rounded border bg-gray-100"
                />
              )}
            />
            <button
              type="button"
              onClick={() => {
                append({
                  id: control._formValues.selectedIngredient?.id,
                  name: control._formValues.newIngredient,
                  unit: control._formValues.ingredientUnit,
                  quantity: Number(control._formValues.ingredientQuantity) || 0,
                });

                setValue("newIngredient", "");
                setValue("ingredientQuantity", "");
                setValue("ingredientUnit", "");
                setSearchTerm("");
                setShowQuantityFields(false);
              }}
              className="px-4 py-2 text-white bg-color-primary hover:bg-color-secondary rounded flex items-center"
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
            {`${searchTerm} not found. Needs to be added before use`}
          </div>
          <button
            type="button"
            className="px-4 py-2 text-white bg-color-primary hover:bg-color-secondary rounded"
            onClick={() => {
              setNewIngredientName(searchTerm);
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
