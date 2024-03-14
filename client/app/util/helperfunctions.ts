export function createSlug(title: string): string {
  // Convert the title to lowercase
  const lowerCaseTitle = title.toLowerCase();

  // Replace spaces with hyphens
  const spaceReplacedTitle = lowerCaseTitle.replace(/\s+/g, "-");

  // Remove special characters except hyphens
  const slug = spaceReplacedTitle.replace(/[^a-z0-9-]/g, "");

  return slug;
}
