import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CategoryMenuProps {
  title: string;
  href: string;
  imageUrl?: string;
  description?: string;
}

const CategoryMenu = ({
  title,
  href,
  imageUrl,
  description,
}: CategoryMenuProps) => {
  return (
    <li>
      <Link href={href} className="block p-3 rounded-md hover:bg-accent">
        <div className="flex flex-col gap-2">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`${title} image`}
              width={100}
              height={100}
              className="rounded-md"
            />
          )}
          <span className="font-medium">{title}</span>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </Link>
    </li>
  );
};

export default CategoryMenu;
