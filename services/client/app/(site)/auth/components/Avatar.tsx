"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { CiUser } from "react-icons/ci";
import { useAppContext, UserProfile } from "@/context/AppContext";

export type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  imageUrl: string;
};

const Avatar = () => {
  const { state } = useAppContext();
  const user = state.profile;
  if (!user) return <CiUser size={24} />;

  return (
    <div className="flex items-center gap-2">
      {user?.firstName && user.lastName && (
        <div className="text-nowrap">{`${user?.firstName} ${user?.lastName}`}</div>
      )}
      {user.imageUrl ? (
        <div className="flex gap-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={user.imageUrl}
              alt={user.username}
              className="w-full h-auto object-cover"
              layout="responsive"
              sizes="(min-width: 60em) 24vw, (min-width: 28em) 45vw, 100vw"
              width={32}
              height={32}
            />
          </div>
        </div>
      ) : (
        <UserInitialsAvatar profile={user} />
      )}
    </div>
  );
};

export default Avatar;

const UserInitialsAvatar = ({ profile }: { profile: UserProfile }) => {
  return (
    <div className="w-8 h-8 rounded-full bg-color-secondary text-white font-bold flex items-center justify-center">
      {profile.firstName?.[0]}
      {profile.lastName?.[0]}
    </div>
  );
};
