import useSWR from "swr";

const useUser = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return res.json();
  };

  // Define URL based on environment
  const url =
    typeof window === "undefined"
      ? "/auth-service/api/users/currentuser" // Server-side URL
      : "/api/users/currentuser"; // Client-side URL

  // Use SWR with the selected URL
  const { data, error } = useSWR(url, fetcher);
  console.log(data);

  return {
    user: data?.currentUser,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useUser;
