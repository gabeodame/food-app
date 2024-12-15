"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CiUser } from "react-icons/ci";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export interface DropdownMenuItem {
  label: string;
  defaultChecked?: Checked;
  disabled?: boolean;
  component?: React.ReactNode;
}

export interface DropdownMenuComponentProps {
  triggerComponent: React.ReactNode;
  items: DropdownMenuItem[];
  label?: string;
  separator?: boolean;
}

export const DropdownMenuCheckboxes = ({
  triggerComponent,
  items,
  label,
  separator = true,
}: DropdownMenuComponentProps) => {
  const [checkedStates, setCheckedStates] = React.useState<Checked[]>(
    items.map((item) => item.defaultChecked ?? false)
  );

  const handleCheckedChange = (index: number, checked: boolean) => {
    setCheckedStates((prev) => {
      const newCheckedStates = [...prev];
      newCheckedStates[index] = checked;
      return newCheckedStates;
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerComponent}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
        {separator && <DropdownMenuSeparator />}
        {items.map((item, index) =>
          item.component ? (
            <React.Fragment key={index}>{item.component}</React.Fragment>
          ) : (
            <DropdownMenuCheckboxItem
              key={index}
              checked={checkedStates[index]}
              onCheckedChange={(checked) => handleCheckedChange(index, checked)}
              disabled={item.disabled}
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
