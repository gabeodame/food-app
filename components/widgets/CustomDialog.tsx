import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DialogProps {
  trigger?: string | React.ReactNode;
  title?: string;
  open?: boolean;
  setOpen?: () => void;
  description?: string;
  children: React.ReactNode;
}

function CustomDialog({
  trigger,
  title,
  description,
  open,
  setOpen,
  children,
}: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader className="flex">
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogDescription className="">{description}</DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-0 items-center space-x-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomDialog;
