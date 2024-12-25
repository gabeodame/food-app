"use client";

import useUser from "@/app/hooks/useUser";

function UserDashboard({ params }: { params: { slug: string } }) {
  const { user, isLoading, isError } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data.</div>;
  console.log(user?.username);

  return <div className="">{user?.username}</div>;
}

export default UserDashboard;
