"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import fetchData from "@/app/util/fetchData";
import { useRouter, usePathname } from "next/navigation";

function Login() {
  const router = useRouter();
  const pathname = usePathname();
  const userLoginSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  type userInput = z.infer<typeof userLoginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userInput>({
    resolver: zodResolver(userLoginSchema),
  });

  const submitData = async (data: userInput) => {
    console.log(data);
    const userData = await fetchData("/api/users/signin", "post", data);

    if (!userData.errors || userData.errors === null) {
      router.push(`/auth/dashboard`);
    } else {
      console.log(userData.errors);
    }
  };

  return (
    <form
      action=""
      className="w-full h-full flex flex-col gap-4 p-2"
      onSubmit={handleSubmit(submitData)}
    >
      <div className="">
        <label htmlFor="username" className="font-semibold">
          Username
        </label>
        <input
          {...register("username")}
          type="text"
          id="username"
          autoComplete="username"
          className="w-full py-2 px-3 border border-gray-100 focus:outline-slate-200"
          placeholder="Enter username"
        />
        {errors.username?.message && (
          <p>{errors.username?.message as string}</p>
        )}
      </div>
      <div className="">
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="w-full p-2 rounded-md border-gray-100 focus:outline-slate-200"
          placeholder="Enter password"
          autoComplete="current-password"
        />
        {errors.password?.message && (
          <p>{errors.password?.message as string}</p>
        )}
      </div>

      <div className="w-full">
        <button
          type="submit"
          className="bg-color-green w-full flex justify-center p-2 text-gray-50 font-semibold rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default Login;
