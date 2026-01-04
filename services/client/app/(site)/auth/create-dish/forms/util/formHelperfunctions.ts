/** ✅ Handles Image Upload */
export const processImageUpload = async (
  imageUrl: FileList | string,
  existingImageUrl?: string
) => {
  let finalImageUrl = existingImageUrl ?? "";
  const fileInput = imageUrl as unknown as FileList;
  const file = fileInput?.[0];

  if (file instanceof File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("service", "userprofile");

    formData.append("fileType", "recipe-image");

    try {
      const fileUploadRes = await fetch("/api/1/uploads/upload", {
        method: "POST",
        body: formData,
      });

      if (fileUploadRes.ok) {
        const resData = await fileUploadRes.json();
        finalImageUrl = resData?.fileUrl;
      } else {
        console.error("Image upload failed:", fileUploadRes.status);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
  return finalImageUrl;
};

/** ✅ Cleanup & Duplicate Filtering (Only for Updates) */
export const formatUpdatePayload = (data: any) => {
  // ✅ Ensure only `name` is sent for relational fields
  [
    "categories",
    "tags",
    "cuisineTypes",
    "seasonalEvent",
    "specialDiets",
  ].forEach((key) => {
    if (data[key]) {
      data[key] = removeDuplicates(data[key], "name").map(
        ({ name }: { name: string }) => ({
          name,
        })
      );
    }
  });

  // ✅ Validate & structure `ingredients`
  if (data.ingredients) {
    data.ingredients = removeDuplicates(data.ingredients, "id").map(
      ({
        id,
        name,
        quantity,
        unit,
      }: {
        id?: number;
        name: string;
        quantity: number;
        unit: string;
      }) => ({
        id: Number(id),
        name,
        quantity: quantity ? Number(quantity) : null,
        unit: unit || "",
      })
    );
  }

  // ✅ Ensure `instructions` contain only required fields
  if (data.instructions) {
    data.instructions = data.instructions.map(
      (inst: { id?: number; step: string }) => ({
        id: inst.id ? Number(inst.id) : undefined,
        step: inst.step,
      })
    );
  }

  // ✅ Remove empty arrays to prevent validation errors
  [
    "ingredients",
    "cuisineTypes",
    "categories",
    "tags",
    "seasonalEvent",
    "specialDiets",
    "instructions",
  ].forEach((key) => {
    if (Array.isArray(data[key]) && data[key].length === 0) {
      delete data[key];
    }
  });

  return data;
};

/** ✅ Utility Function to Remove Duplicates by Key */
export const removeDuplicates = (array: any[], key: string) => {
  return array.reduce((acc, current) => {
    if (!acc.some((item: Record<string, any>) => item[key] === current[key])) {
      acc.push(current);
    }
    return acc;
  }, []);
};
