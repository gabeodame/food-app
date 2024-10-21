export function createSlug(title: string): string {
  // Convert the title to lowercase
  const lowerCaseTitle = title.toLowerCase();

  // Replace spaces with hyphens
  const spaceReplacedTitle = lowerCaseTitle.replace(/\s+/g, "-");

  // Remove special characters except hyphens
  const slug = spaceReplacedTitle.replace(/[^a-z0-9-]/g, "");

  return slug;
}

import getPlaiceholder from "@plaiceholder/next";
import { CustomError } from "@gogittix/common";

export const getImage = async (src: string) => {
  const res = await fetch(src);

  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status} - ${res.statusText}`);
  }
  const buffer = await res.arrayBuffer();
  const { base64 } = await getPlaiceholder(Buffer.from(buffer));

  return base64;
};
