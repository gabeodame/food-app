"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CiUser } from "react-icons/ci";

export type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  imageUrl: string;
};

const Avatar = ({ profile }: { profile: User }) => {
  const [userProfile, setUserProfile] = React.useState<User | null>(null);

  useEffect(() => {
    if (profile) {
      setUserProfile(profile);
    }
  }, [profile]);

  if (!userProfile) return <CiUser size={24} />;

  return (
    <div className="flex items-center gap-2">
      {profile?.firstName && profile.lastName && (
        <div className="text-nowrap">{`${userProfile?.firstName} ${userProfile?.lastName}`}</div>
      )}
      {userProfile.imageUrl ? (
        <div className="flex gap-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={userProfile.imageUrl}
              alt={userProfile.username}
              className="w-full h-auto object-cover"
              layout="responsive"
              sizes="(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw"
              width={32}
              height={32}
            />
          </div>
        </div>
      ) : (
        <UserInitialsAvatar profile={userProfile} />
      )}
    </div>
  );
};

export default Avatar;

const UserInitialsAvatar = ({ profile }: { profile: User }) => {
  return (
    <div className="w-8 h-8 rounded-full bg-color-secondary text-white font-bold flex items-center justify-center">
      {profile.firstName?.[0]}
      {profile.lastName?.[0]}
    </div>
  );
};
