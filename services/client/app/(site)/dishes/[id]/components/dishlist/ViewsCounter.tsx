"use client";
import { EyeIcon } from "@heroicons/react/20/solid";

type ViewsCounterProps = {
  views: number;
};

export default function ViewsCounter({ views }: ViewsCounterProps) {
  return (
    <div className="flex items-center text-gray-600 text-sm">
      <EyeIcon className="h-4 w-4 mr-1" />
      <span>{views} views</span>
    </div>
  );
}
