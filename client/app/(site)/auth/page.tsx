import { TabsList, Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import Login from "./components/Login";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/themes";
import SignUp from "./components/Signup";

export default function Auth() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-md py-6 px-3">
        {/* <CardHeader>
          <p className="text-xl font-semibold">Login</p>
        </CardHeader> */}

        <CardContent className="flex flex-col gap-4 min-h-full">
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
        </CardContent>
        {/* <Separator className="bg-color-secondary h-[2px] w-full my-4" /> */}
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
