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
      {trigger && <DialogTrigger className="w-full">{trigger}</DialogTrigger>}
      <DialogContent className="max-w-[85%] md:w-full h-[65%] min-h-[280px] flex flex-col items-center">
        <DialogHeader className="flex">
          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogDescription className="">{description}</DialogDescription>
        </DialogHeader>
        <div className="w-full h-full flex flex-col gap-0 items-center space-x-2 overflow-hidden">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomDialog;
