import React, { useState } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { FiPlus, FiTrash } from "react-icons/fi";

interface DynamicFormArrayProps {
  label: string;
  fieldName: string;
  control: Control<any>;
  placeholder?: string;
}

const DynamicFormArray = ({
  label,
  fieldName,
  control,
  placeholder = "Enter values, separated by commas",
}: DynamicFormArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const [inputValue, setInputValue] = useState("");

  // ✅ Handle Enter key to add items
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addItems(inputValue);
    }
  };

  // ✅ Add items, ensuring no duplicates
  const addItems = (input: string) => {
    const newValues = input
      .split(",")
      .map((val) => val.trim())
      .filter(
        (val) =>
          val &&
          !fields.some(
            (item: any) => item.name.toLowerCase() === val.toLowerCase()
          )
      );

    if (newValues.length === 0) return;

    newValues.forEach((name) => append({ name })); // ✅ Append to form state

    setInputValue(""); // ✅ Clear input after adding
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      {/* Input & Add Button */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => addItems(inputValue)}
          className="px-4 py-2 text-white bg-color-primary hover:bg-color-secondary rounded"
        >
          <FiPlus size={16} />
        </button>
      </div>

      {/* Render Items */}
      <div className="flex flex-wrap gap-2">
        {fields.map((item: any, index) => (
          <div
            key={item.id || index}
            className="bg-color-secondary text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-sm"
          >
            <span>{item.name}</span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicFormArray;
