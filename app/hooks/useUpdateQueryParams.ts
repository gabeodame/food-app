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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      // Determine the base URL based on whether the current page is a detail page
      const baseUrl = isDetailPage()
        ? "/foods"
        : !pathname.split("/")[0].length
        ? "/foods"
        : pathname;
      const newUrl = `${baseUrl}?${params.toString()}`;

      router.push(newUrl);
    },
    [searchParams, router]
  );

  return createQueryString;
}

export default useUpdateQueryParams;
