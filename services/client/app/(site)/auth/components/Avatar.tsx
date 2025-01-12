"use client";

import React from "react";
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

const Avatar = ({ profile }: { profile: User }) => {
  return (
    <div className="flex items-center gap-2">
      {profile.imageUrl ? (
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
        <UserInitialsAvatar profile={profile} />
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
