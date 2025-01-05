"use client";

import React, { Suspense, useEffect, useState } from "react";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@radix-ui/themes";

import Login from "./Login";
import SignUp from "./Signup";
import { usePathname, useSearchParams } from "next/navigation";

function LoginForm() {
  const [formState, setFormState] = useState<"login" | "signup">("login");
  const searchParams = useSearchParams();

  useEffect(() => {
    const loginParam = searchParams.get("login");
    if (loginParam === "signup") {
      setFormState("signup");
    } else {
      setFormState("login");
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    if (value === "login" || value === "signup") {
      setFormState(value);
    }
  };

  return (
    <Tabs value={formState} onValueChange={handleTabChange}>
      <TabsList className="w-full h-full flex justify-evenly">
        <TabsTrigger value="login" className="w-full">
          Login
        </TabsTrigger>
        <TabsTrigger value="signup" className="w-full">
          Signup
        </TabsTrigger>
      </TabsList>
      <Separator className="bg-color-secondary h-[2px] w-full my-4" />
      <TabsContent value="login">
        <Login />
      </TabsContent>
      <TabsContent value="signup">
        <SignUp />
      </TabsContent>
    </Tabs>
  );
}

export default LoginForm;
