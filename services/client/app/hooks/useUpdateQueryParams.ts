import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

function useUpdateQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateQueryParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (params.get(name) === value) {
        params.delete(name); // ✅ Toggle: Remove if already exists
      } else {
        params.set(name, value); // ✅ Otherwise, add new value
      }

      // ✅ Always navigate to `/dishes` when filtering from a detail page
      const isDetailPage = /^\/dishes\/\d+$/.test(pathname);
      const baseUrl = isDetailPage ? "/dishes" : pathname;

      router.push(`${baseUrl}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  return updateQueryParams;
}

export default useUpdateQueryParams;
