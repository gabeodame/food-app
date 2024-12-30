"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";

export type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  imageUrl: string;
};

async function Avatar({ email }: { email: string }) {
  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const url = `/api/1/profile/email/${email}`;
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
  }, [email]);

  //   const profile = await GetProfile({ email: user.email });
  //   console.log("profile", profile);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {profile ? (
        <div className="flex items-center gap-2">
          {profile?.imageUrl ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={profile.imageUrl}
                alt={profile.username}
                className="w-full h-auto object-cover"
                layout="responsive"
                sizes="(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw"
                width={32}
                height={32}
              />
            </div>
          ) : (
            <UserInitialsAvatar profile={profile as User} />
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </Suspense>
  );
}

export default Avatar;

const UserInitialsAvatar = ({ profile }: { profile: User }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-color-secondary text-white font-bold flex items-center justify-center">
        {profile?.firstName ? profile.firstName[0] : ""}
        {profile?.lastName ? profile.lastName[0] : ""}
      </div>
    </div>
  );
};
