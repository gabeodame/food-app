import React, { useState, useEffect, useRef } from "react";
import { Ingredient } from "../types/types"; // Assuming Ingredient type is defined elsewhere

interface AutoCompleteProps {
  options: any[];
  value: string;
  placeholder?: string;
  onInputChange: (value: string) => void;
  onSelect: (ingredient: Ingredient) => void;
}

export const AutoComplete = ({
  options,
  value,
  placeholder,
  onInputChange,
  onSelect,
}: AutoCompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      {/* Input field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onInputChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
      />

      {/* Dropdown suggestions */}
      {isOpen && options.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 bg-white border rounded shadow-md w-full max-h-48 overflow-auto"
        >
          <ul className="list-none">
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="p-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center"
              >
                <span>{option.name}</span>
                {option.category && (
                  <span className="text-xs text-gray-500">
                    {option.category}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
