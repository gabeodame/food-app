import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React, { useCallback } from "react";

function useUpdateQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isDetailPage = useCallback(() => {
    const detailPageRegex = /^\/foods\/\d+$/; // Example: matches "/foods/123"
    return detailPageRegex.test(pathname);
  }, [pathname]);

  const updateQueryParams = useCallback(
    (name: string | null, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (name && value !== null) {
        params.set(name, value); // Set or update parameter
      } else if (name) {
        params.delete(name); // Delete parameter if value is null
      }

      const baseUrl =
        isDetailPage() || pathname === "/foods" ? "/foods" : pathname;
      const newUrl = `${baseUrl}?${params.toString()}`;

      router.push(newUrl);
    },
    [searchParams, router, pathname, isDetailPage]
  );

  return updateQueryParams;
}

export default useUpdateQueryParams;
