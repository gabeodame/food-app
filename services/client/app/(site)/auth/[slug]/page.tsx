import { Separator } from "@radix-ui/themes";
import FoodList from "../../components/FoodList/FoodList";
import { getUserRecipes } from "../actions/getUserRecipes";
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
  // const { user, isLoading, isError } = useUser();
  console.log(params);
  console.log(searchParams);

  // if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>Error loading user data.</div>;

  const userRecipes = await getUserRecipes();

  console.log(userRecipes);
  console.log("slug", params.slug);

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
          {userRecipes.length > 0 ? (
            <FoodList foodData={userRecipes} />
          ) : (
            <p>You currently do not have any Recipes</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
