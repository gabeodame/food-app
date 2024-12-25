"use client";

import React, { ReactElement } from "react";
import { Button } from "./Button";

interface ButtonProps {
  onClick: () => void;
  children: ReactElement;
  rest?: any;
}

function CustomButton({ onClick, children, rest }: ButtonProps) {
  return (
    <Button onClick={onClick} {...rest}>
      {children}
    </Button>
  );
}

export default CustomButton;
