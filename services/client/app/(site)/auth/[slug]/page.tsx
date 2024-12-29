"use client";

import useUser from "@/app/hooks/useUser";
import { useEffect, useState } from "react";
import { User } from "../components/Avatar";

function UserDashboard({ params }: { params: { slug: string } }) {
  const { user, isLoading, isError } = useUser();
  const [profile, setProfile] = useState<User | null>(null);

  // this can be a custom hook as it is used in multiple components
  useEffect(() => {
    const getProfile = async () => {
      try {
        const url = `/api/1/profile/email/${user.email}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getProfile();
  }, [user?.email]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user data.</div>;

  return (
    <div className="">
      <h1>Welcome back {profile?.firstName}</h1>
      <p>Here are some of your recent activities:</p>
    </div>
  );
}

export default UserDashboard;
