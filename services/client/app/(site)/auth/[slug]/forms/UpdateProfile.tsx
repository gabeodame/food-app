"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const schema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" }),
  bio: z.string().optional(),
  imageUrl: z.any().optional(),
});

type FormProps = z.infer<typeof schema>;

function UpdateProfile() {
  const { state, setProfile } = useAppContext();
  const profile = state.profile;
  const router = useRouter();
  const [showImageUpload, setShowImageUpload] = useState(false); // Toggle image upload input

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      bio: profile?.bio || "",
    },
  });

  // Prefill form with user data
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        bio: profile.bio || "",
      });

      if (!profile.imageUrl) {
        setShowImageUpload(true); // Show image upload input if no image
      }
    }
  }, [profile, reset]);

  console.log("Profile show imageUpload:", showImageUpload);

  const onSubmit: SubmitHandler<FormProps> = async (data) => {
    if (!profile?.id) {
      console.error("Profile ID not found");
      return;
    }

    const fileInput = data.imageUrl as unknown as FileList;
    const file = fileInput && fileInput[0];
    let imageUrl = profile.imageUrl || null;

    try {
      // Step 1: Upload Image (only if new image selected)
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("service", "userprofile");
        formData.append("entityId", profile.id);
        formData.append("fileType", "profile-image");

        const imageResponse = await fetch(`/api/1/uploads/upload`, {
          method: "POST",
          body: formData,
        });

        if (imageResponse.ok) {
          const res = await imageResponse.json();
          imageUrl = res?.fileUrl;
        } else {
          console.error("Failed to upload image");
        }
      }

      // Step 2: Update Profile (exclude `imageUrl` if it hasn't changed)
      const updatedProfileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        ...(imageUrl !== profile.imageUrl && { imageUrl }), // Only include `imageUrl` if changed
      };

      const response = await fetch(`/api/1/profile/${profile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile); // Update global state
        router.push("/auth/dashboard"); // Navigate to dashboard
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="w-full h-full flex justify-center p-2">
      <div className="w-[50rem] h-auto bg-gray-50 rounded-md shadow-sm p-4">
        <h2 className="text-2xl font-bold text-color-primary mb-4">
          Update Profile
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          {/* Name Fields */}
          <div className="w-full flex gap-4">
            <div className="w-full">
              <input
                className="w-full bg-color-primary-light rounded-md p-2 placeholder-gray-400 focus:outline-0 text-white"
                type="text"
                placeholder="First Name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="text-red-400 text-sm">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="w-full">
              <input
                className="w-full bg-color-primary-light rounded-md p-2 placeholder-gray-400 focus:outline-0 text-white"
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <span className="text-red-400 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          {/* Bio Field */}
          <div className="w-full">
            <textarea
              rows={5}
              className="w-full bg-color-primary-light rounded-md p-2 placeholder-gray-400 focus:outline-0 text-white"
              placeholder="Bio"
              {...register("bio")}
            />
            {errors.bio && (
              <span className="text-red-400 text-sm">{errors.bio.message}</span>
            )}
          </div>

          {/* Profile Image */}
          <div className="w-full flex flex-col items-center gap-2">
            {profile?.imageUrl && (
              <div className="flex flex-col items-center">
                <Image
                  src={profile.imageUrl}
                  alt="Profile Image"
                  width={100}
                  height={100}
                  className="rounded-full border border-gray-300"
                />
                <button
                  type="button"
                  className="mt-2 text-sm text-blue-500 underline"
                  onClick={() => setShowImageUpload(true)}
                >
                  Change Profile Picture
                </button>
              </div>
            )}
            {showImageUpload && (
              <input
                className="w-full bg-color-primary-light rounded-md p-2 placeholder-gray-400 focus:outline-0 text-white"
                type="file"
                {...register("imageUrl")}
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            className="w-full md:w-fit flex items-center justify-center bg-color-primary-alt py-2 px-4 text-white rounded-md md:self-end"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
