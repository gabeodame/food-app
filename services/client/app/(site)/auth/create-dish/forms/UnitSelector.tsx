"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Controller, Control, useWatch } from "react-hook-form";
import { units } from "../schema/units";

interface UnitSelectorProps {
  control: Control;
  name: string;
  onSelection?: (unit: string) => void;
  setValue: any;
  getValues: any;
}

type UnitSystem =
  | "metric"
  | "imperial"
  | "custom"
  | "cooking"
  | "bakery"
  | "generic";

function UnitSelector({
  control,
  name,
  onSelection,
  setValue,
  getValues,
}: UnitSelectorProps) {
  const [system, setSystem] = useState<UnitSystem>("imperial");
  const unitOptions = useMemo(() => units, []);

  // Local state to prevent excessive re-renders
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  // Watch only this field instead of the entire form
  const watchedUnit = useWatch({ control, name });

  // Clear errors on change

  // Initialize unit on mount if value exists
  useEffect(() => {
    const existingValue = getValues(name);
    if (existingValue) {
      setSelectedUnit(existingValue); // Sync local state
    } else if (system !== "custom") {
      const defaultUnit = unitOptions[system][0];
      setSelectedUnit(defaultUnit);
      setValue(name, defaultUnit, { shouldDirty: true, shouldValidate: true });
      control.setError(name, { type: "manual", message: "" });
    }
  }, [system, getValues, setValue, name, unitOptions]);

  // Handle system change efficiently
  const handleSystemChange = (newSystem: UnitSystem) => {
    setSystem(newSystem);
    if (newSystem !== "custom") {
      const defaultUnit = unitOptions[newSystem][0];
      setSelectedUnit(defaultUnit);
      setValue(name, defaultUnit, { shouldDirty: true, shouldValidate: true });
      onSelection?.(defaultUnit);
    } else {
      setSelectedUnit("");
      setValue(name, "", { shouldDirty: true, shouldValidate: true });
    }
  };

  // Handle unit selection change
  const handleUnitChange = (newUnit: string) => {
    setSelectedUnit(newUnit);
    setValue(name, newUnit, { shouldDirty: true, shouldValidate: true });
    onSelection?.(newUnit);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Unit System Selection */}
      <div className="flex flex-col gap-1">
        <label htmlFor={name} className="text-sm font-medium text-gray-800">
          Unit System:
        </label>
        <select
          value={system}
          onChange={(e) => handleSystemChange(e.target.value as UnitSystem)}
          className="p-2 bg-color-secondary-light rounded border focus:outline-none"
        >
          {Object.keys(units).map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Unit Selection (Appears only if not "custom") */}
      {system !== "custom" && (
        <select
          value={selectedUnit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="p-2 bg-color-secondary-light rounded border focus:outline-none"
        >
          {unitOptions[system].map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      )}

      {/* Manual Input for Custom Unit */}
      {system === "custom" && (
        <input
          type="text"
          placeholder="Enter custom unit"
          value={selectedUnit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="p-2 bg-color-secondary-light rounded border focus:outline-none"
        />
      )}
    </div>
  );
}

export default UnitSelector;
