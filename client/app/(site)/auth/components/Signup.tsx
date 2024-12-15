"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import fetchData from "@/app/util/fetchData";
import { useRouter } from "next/navigation";

function SignUp() {
  const router = useRouter();

  const userSignupInput = z
    .object({
      username: z
        .string()
        .min(4, { message: "Username must be at least 4 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }),
      email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(4, { message: "Enter a valid email" }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" }),
      confirm_password: z.string().min(8, { message: "Confirm your password" }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"],
    });

  type userSignupType = z.infer<typeof userSignupInput>;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<userSignupType>({
    resolver: zodResolver(userSignupInput),
  });

  const onSubmit = async (data: userSignupType) => {
    reset(undefined, { keepValues: true }); // Clear previous errors

    const userData = await fetchData("/api/users/signup", "post", {
      email: data.email,
      username: data.username,
      password: data.password,
    });

    if (userData.data && !userData.data.errors) {
      console.log(userData.data.message || "Signup successful");
      router.push("/auth?login=login");
    } else if (Array.isArray(userData.errors)) {
      // Handle array of server-side errors
      userData.errors.forEach((err: { message: string; field?: string }) => {
        if (err.field) {
          setError(err.field as keyof userSignupType, {
            type: "server",
            message: err.message,
          });
        } else {
          setError("root", { type: "server", message: err.message });
        }
      });
    } else if (userData.errors) {
      // Handle a single error object
      setError("root", {
        type: "server",
        message: userData.errors.message || "An error occurred",
      });
    } else if (userData.error) {
      // Handle unexpected errors (e.g., network issues)
      setError("root", {
        type: "server",
        message: userData.error.message || "Something went wrong",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full flex flex-col gap-4 p-2"
      autoComplete="off"
    >
      {/* Username Field */}
      <div>
        <label htmlFor="username" className="font-semibold">
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          id="username"
          className="w-full py-2 px-3 border border-gray-200 focus:outline-slate-200"
          placeholder="Enter username"
        />
        {errors.username && (
          <p className="text-sm text-red-400 py-1">{errors.username.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="font-semibold">
          Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="w-full py-2 px-3 border border-gray-200 focus:outline-slate-200"
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="text-sm text-red-400 py-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="w-full py-2 px-3 border border-gray-200 focus:outline-slate-200"
          placeholder="Enter password"
        />
        {errors.password && (
          <p className="text-sm text-red-400 py-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirm_password" className="font-semibold">
          Confirm Password
        </label>
        <input
          {...register("confirm_password")}
          type="password"
          id="confirm_password"
          className="w-full py-2 px-3 border border-gray-200 focus:outline-slate-200"
          placeholder="Confirm password"
        />
        {errors.confirm_password && (
          <p className="text-sm text-red-400 py-1">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      {/* Root-Level Errors */}
      {errors.root && (
        <div
          aria-describedby="form-error"
          className="text-red-800 text-sm bg-red-200 py-2 px-4 rounded"
        >
          {errors.root.message}
        </div>
      )}

      <div className="w-full">
        <input
          type="submit"
          className="bg-color-green w-full p-2 text-gray-50 font-semibold rounded-md"
          title="Signup"
        />
      </div>
    </form>
  );
}

export default SignUp;
