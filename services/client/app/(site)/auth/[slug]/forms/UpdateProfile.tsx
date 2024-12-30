"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { set, z } from "zod";
import { User } from "../../components/Avatar";
import { useRouter } from "next/navigation";
type formProps = {
  firstName: string;
  lastName: string;
  bio?: string;
  imageUrl?: string;
};

const schema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" }),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
});

function UpdateProfile({ email }: { email: string }) {
  const [profile, setProfile] = useState<User>();
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

  console.log("profile", profile);
  console.log("email", email);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<formProps>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<formProps> = async (data) => {
    try {
      const url = `/api/1/profile/${profile?.id}`;

      const { firstName, lastName, bio, imageUrl } = data;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, bio, imageUrl }),
      });

      if (response.ok) {
        console.error("Failed to update profile");
        const res = await response.json();

        router.push("/auth/profile");
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
              type="text"
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
