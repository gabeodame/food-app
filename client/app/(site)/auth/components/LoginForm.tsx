"use client";

import React, { use, useEffect } from "react";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@radix-ui/themes";

import Login from "./Login";
import SignUp from "./Signup";
import { usePathname, useSearchParams } from "next/navigation";

function LoginForm() {
  return (
    <Tabs className="" defaultValue="login">
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
