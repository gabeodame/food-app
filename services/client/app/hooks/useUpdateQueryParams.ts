import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

function useUpdateQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isDetailPage = useCallback(() => {
    return /^\/dishes\/\d+$/.test(pathname); // Matches "/dishes/123"
  }, [pathname]);

  const updateQueryParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (params.get(name) === value) {
        params.delete(name); // ✅ Remove if it already exists (toggle behavior)
      } else {
        params.set(name, value); // ✅ Otherwise, set new value
      }

      const baseUrl =
        isDetailPage() || pathname === "/dishes" ? "/dishes" : pathname;
      const newUrl = `${baseUrl}?${params.toString()}`;

      router.push(newUrl);
    },
    [searchParams, router, pathname, isDetailPage]
  );

  return updateQueryParams;
}

export default useUpdateQueryParams;
