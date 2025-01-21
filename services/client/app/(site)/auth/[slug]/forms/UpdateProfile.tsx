"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "../../components/Avatar";
import { useRouter } from "next/navigation";

type formProps = {
  firstName: string;
  lastName: string;
  bio?: string;
  imageUrl?: File[] | null;
};

const InitialProfile: formProps = {
  firstName: "",
  lastName: "",
  bio: "",
  //   imageUrl: null,
};

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

function UpdateProfile({ email }: { email: string }) {
  const [profile, setProfile] = useState<User>();
  //   const [initalProfile, setInitialProfile] =
  //     useState<formProps>(InitialProfile);
  const router = useRouter();

  // this can be a custom hook as it is used in multiple components
  useEffect(() => {
    const getProfile = async () => {
      try {
        if (email) {
          const url = `/api/1/profile/email/${email}`;
          const response = await fetch(url);
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfile();
  }, [email]);

  useEffect(() => {
    reset({
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      bio: profile?.bio,
    });
  }, [profile]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<formProps>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      bio: profile?.bio,
      // imageUrl: profile?.imageUrl,
    },
  });

  console.log(watch("imageUrl"));

  const onSubmit: SubmitHandler<formProps> = async (data) => {
    const formData = new FormData();
    const fileInput = data.imageUrl as unknown as FileList;
    const file = fileInput && fileInput[0];

    try {
      let imageUrl = null;

      // Step 1: Upload the image via the uploads-service
      if (file) {
        formData.append("file", file);
        formData.append("service", "userprofile"); // Specify the service name
        formData.append("entityId", profile?.id || ""); // Specify the user ID
        formData.append("fileType", "profile-image"); // Specify the file type

        const imageResponse = await fetch(`/api/1/uploads/upload`, {
          method: "POST",
          body: formData,
        });

        if (imageResponse.ok) {
          const res = await imageResponse.json();
          console.log("Image uploaded:", res);
          imageUrl = res?.fileUrl; // Extract the uploaded image URL
        } else {
          console.error("Failed to upload image");
          return;
        }
      }

      // Step 2: Update the user profile
      const url = `/api/1/profile/${profile?.id}`;
      const { firstName, lastName, bio } = data;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          imageUrl, // Include the uploaded image URL
        }),
      });

      if (response.ok) {
        const res = await response.json();
        console.log("Profile updated:", res);
        reset(); // Reset the form after successful submission
        router.push("/auth/profile"); // Redirect to the profile page
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  //   console.log(watch("firstName"));
  //   console.log(errors);
  return (
    <div className="w-full h-full flex justify-center p-2">
      <div className="w-[50rem] h-auto bg-gray-50 rounded-md shadow-sm p-4">
        <h2 className="text-2xl font-bold text-color-primary mb-4">
          Update Profile
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 "
        >
          <div className="w-full h-full flex gap-4 rounded-md ">
            <div className="w-full">
              <input
                className="w-full bg-color-primary-light rounded-md p-2 placeholder-gray-400 focus:outline-0 text-white"
                type="text"
                placeholder="First Name"
                {...register("firstName", { required: true })}
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
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <span className="text-red-400 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
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
          <div className="w-full">
            {/* would be an upload file */}
            <input
              className="w-full bg-color-primary-light rounded-md p-2 placeholder-gray-400 focus:outline-0 text-white"
              type="file"
              placeholder="Image URL"
              {...register("imageUrl")}
            />
            {errors.imageUrl && (
              <span className="text-red-400 text-sm">
                {errors.imageUrl.message}
              </span>
            )}
          </div>
          <button
            className="w-full md:w-fit flex items-center justify-center bg-color-primary-alt py-2 px-4 text-white rounded-md md:self-end"
            type="submit"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
