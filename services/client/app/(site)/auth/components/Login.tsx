"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import fetchData from "@/app/util/fetchData";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useTransition } from "react";
import { useSWRConfig } from "swr";

function Login() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { mutate } = useSWRConfig();
  const {
    setProfile,
    state: { profile },
  } = useAppContext();
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
    // console.log(userData);

    if (!userData.errors || userData.errors === null) {
      const authUser = userData.data;
      mutate("/api/users/currentuser", { currentUser: authUser }, false);

      if (authUser?.id || authUser?.email || authUser?.username) {
        setProfile({
          id: authUser.id,
          username: authUser.username ?? authUser.email ?? "User",
          email: authUser.email ?? "",
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          bio: authUser.bio,
          imageUrl: authUser.imageUrl,
        });
      }

      if (authUser?.email) {
        try {
          const res = await fetch(
            `/api/1/profile/by-email/${authUser.email}`,
            { cache: "no-store" }
          );
          if (res.ok) {
            const profileData = await res.json();
            setProfile(profileData);
          }
        } catch (error) {
          console.error("Failed to load profile after login", error);
        }
      }

      startTransition(() => {
        router.push(`/auth/dashboard`);
        router.refresh();
      });
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
          disabled={isPending}
        >
          {isPending ? "Signing in..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default Login;
