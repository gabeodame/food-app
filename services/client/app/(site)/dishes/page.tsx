import DishList from "./[id]/components/DishList";

type SearchParams = { [key: string]: string | string[] | undefined };

export const dynamic = "force-dynamic";

export default async function FoodListHome({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const hasFilters = Boolean(
    searchParams.slug ||
      searchParams.category ||
      searchParams.ingredientName
  );

  return (
    <section>
      <div className="w-full md:container px-4 md:px-0 mt-4">
        <DishList
          searchParams={searchParams}
          paginated
          pageSize={12}
          showAllLink={hasFilters}
        />
      </div>
    </section>
  );
}
