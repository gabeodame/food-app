import { Separator } from "@radix-ui/themes";
import DishList from "../../dishes/[id]/components/DishList";
import Header from "./components/Header";
import UpdateProfile from "./forms/UpdateProfile";

type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

export const dynamic = "force-dynamic";

async function UserDashboard({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { userList, limit } = searchParams as {
    userList: string;
    limit: string;
  };
  return (
    <div className="max-w-7xl p-2 md:p-4 lg:p-6 md:gap-4 md:container sm:px-2 md:px-4">
      <Header />
      <Separator className="my-4 h-[2px] bg-color-primary" />
      {searchParams.action === "update" && <UpdateProfile />}
      {/* <h1>Welcome back {profile?.firstName}</h1> */}
      {params.slug === "dashboard" && (
        <div className="">
          <p className="text-color-primary">
            Here are some of your recent activities:
          </p>

          <DishList userList={userList} />
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
