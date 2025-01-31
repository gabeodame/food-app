"use client";

import React, { useEffect, useState } from "react";
import Avatar, { User } from "./Avatar";
import { getUserProfile } from "../actions/getUserProfiles";
import { CiUser } from "react-icons/ci";

const UserProfile = ({ email }: { email: string }) => {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(email);
      setProfile(data);
    };

    fetchProfile(); // Fetch profile on mount
  }, [email]);

  if (!profile) {
    return <CiUser size={24} />;
  }

  return <Avatar profile={profile} />;
};

export default UserProfile;
