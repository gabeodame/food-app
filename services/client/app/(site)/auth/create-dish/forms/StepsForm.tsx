import React, { useState } from "react";
import { useFieldArray, Control, useWatch } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Step {
  id?: string; // Make `id` optional
  step: string;
}

interface StepsFormProps {
  control: Control<any>; // Allow control from any form structure
}

const StepsForm = ({ control }: StepsFormProps) => {
  const { fields, append, remove, move } = useFieldArray<{
    instructions: Step[];
  }>({
    control,
    name: "instructions", // Operates on the `instructions` field
  });
  const watch = useWatch({
    control,
    name: "instructions",
  });

  const [currentStep, setCurrentStep] = useState("");

  const handleStepKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentStep.trim() !== "") {
      e.preventDefault();
      addStep();
    }
  };

  // Add Step
  const addStep = () => {
    if (!currentStep.trim()) return; // Prevent empty steps

    append({ id: `${Date.now()}`, step: currentStep }); // Add a unique `id`
    setCurrentStep(""); // Clear the input field
  };

  // Remove Step
  const removeStep = (index: number) => {
    remove(index); // Remove step by index
  };

  // Handle Drag-and-Drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return; // If dropped outside a valid drop zone

    move(result.source.index, result.destination.index); // Reorder steps
  };

  return (
    <div>
      {/* Draggable Steps */}
      <DragDropContext onDragEnd={onDragEnd}>
        {fields.length > 0 ? (
          <Droppable droppableId="instructions">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 bg-color-secondary rounded border shadow p-4 ${
                  snapshot.isDraggingOver ? "bg-color-primary" : ""
                }`}
              >
                {fields.map((field, index) => (
                  <Draggable
                    key={field.id || index.toString()} // Use `id` if available, fallback to `index`
                    draggableId={field.id || index.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center justify-between gap-2 p-2 bg-white rounded border shadow ${
                          snapshot.isDragging ? "bg-blue-50" : ""
                        }`}
                      >
                        {/* Drag Icon */}
                        <span
                          {...provided.dragHandleProps}
                          className="text-gray-400 cursor-move mr-2"
                        >
                          ⠿
                        </span>

                        {/* Step Content */}
                        <span className="flex-1">{`${index + 1}. ${
                          field.step
                        }`}</span>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ) : null}
      </DragDropContext>
      {/* Add Step */}
      <label className="block text-sm font-medium m-4">Steps</label>

      {/* Input and Add Button */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={currentStep}
          onChange={(e) => setCurrentStep(e.target.value)}
          onKeyDown={handleStepKeyDown}
          className="w-full p-2 bg-color-secondary-light rounded border focus:outline-none"
          placeholder="Enter step description, e.g., 'Preheat the oven to 350°F'"
        />
        <button
          type="button"
          onClick={addStep}
          className="px-4 py-2 text-white bg-color-primary hover:bg-color-secondary rounded"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default StepsForm;
