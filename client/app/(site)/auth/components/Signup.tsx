"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function SignUp() {
  const userSignupInput = z
    .object({
      username: z
        .string()
        .nonempty({ message: "Username is required" })
        .min(4, { message: "Username must be at least 4 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }),
      email: z
        .string()
        .nonempty({ message: "Email is required" })
        .email({ message: "Invalid email address" }),
      password: z
        .string()
        .nonempty({ message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" }),
      confirm_password: z
        .string()
        .nonempty({ message: "Please confirm your password" }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"], // Set the error on the confirm_password field
    });

  type userSignupType = z.infer<typeof userSignupInput>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userSignupType>({
    resolver: zodResolver(userSignupInput),
  });

  const onSubmit = (data: userSignupType) => console.log(data);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      action=""
      className="w-full h-full flex flex-col gap-4 p-2"
      autoComplete="off"
    >
      <div className="">
        <label htmlFor="username" className="font-semibold">
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          name="username"
          id="userName"
          className="w-full py-2 px-3 border border-gray-200 focus:outline-slate-200"
          placeholder="Enter username"
          autoComplete="mew-username"
        />
        {errors.username?.message && (
          <p className="text-sm text-red-400 py-1">
            {errors.username?.message as string}
          </p>
        )}
      </div>
      <div className="">
        <label htmlFor="email" className="font-semibold">
          Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          name="email"
          id="email"
          className="w-full py-2 px-3 border border-gray-200 focus:outline-slate-200"
          placeholder="Enter email address"
          autoComplete="new-email"
        />
        {errors.email?.message && (
          <p className="text-sm text-red-400 py-1">
            {errors.email?.message as string}
          </p>
        )}
      </div>
      <div className="">
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          name="password"
          id="password"
          className="w-full py-2 px-3 border border-gray-200 focus:outline-slate-200"
          placeholder="Enter password"
          autoComplete="new-password"
        />
        {errors.password?.message && (
          <p className="text-sm text-red-400 py-1">
            {errors.password?.message as string}
          </p>
        )}
      </div>
      <div className="">
        <label htmlFor="confirm_password" className="font-semibold">
          Confirm Password
        </label>
        <input
          {...register("confirm_password")}
          type="password"
          name="confirm_password"
          id="confirm_password"
          className="w-full py-2 px-3 border border-gray-200 focus:outline-slate-200"
          placeholder="Confirm password"
          autoComplete="off"
        />
        {errors.confirm_password?.message && (
          <p className="text-sm text-red-400 py-1">
            {errors.confirm_password?.message as string}
          </p>
        )}
      </div>

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
