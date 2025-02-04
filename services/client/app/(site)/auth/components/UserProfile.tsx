"use client";

import React, { useEffect } from "react";
import Avatar from "./Avatar";
import { getUserProfile } from "../actions/getUserProfiles";
import { CiUser } from "react-icons/ci";
import { useAppContext } from "@/context/AppContext";

const UserProfile = ({ email }: { email: string }) => {
  const { state, setProfile } = useAppContext();
  const profile = state.profile; // Get profile from AppContext

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profile) {
        const data = await getUserProfile({ email });
        if (data) {
          setProfile(data); // Store profile globally
        }
      }
    };

    fetchProfile();
  }, [email, profile, setProfile]); // Depend on profile to avoid unnecessary re-fetch

  console.log("Profile from Context:", profile);

  if (!profile) {
    return <CiUser size={24} />;
  }

  return <Avatar />;
};

export default UserProfile;
