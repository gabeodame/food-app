"use client";
import React, { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";

import fetchData from "@/app/util/fetchData";
import {
  DropdownMenuCheckboxes,
  DropdownMenuItem,
} from "@/components/widgets/DropdownMenuCheckboxes";

const menuItems = [
  { trigger: "Profile" },
  { trigger: "Settings" },
  { trigger: "Logout" },
];

async function UserAccount({ items }: { items: DropdownMenuItem[] }) {
  // const [user, setUser] = useState(null);
  // if (typeof window === "undefined") {
  //   const user = await fetchData(
  //     "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/signup",
  //     "get"
  //   );
  //   setUser(user.data);
  //   console.log(user);
  // } else {
  //   const user = await fetchData("/api/users/currentuser", "get");
  //   setUser(user.data);
  //   console.log(user);
  // }
  return (
    <div className="">
      <div className="">
        {/* {" "}
        {user ? (
          <DropdownMenuCheckboxes
            triggerComponent={<CiUser size={24} />}
            items={items}
            label="Appearance"
          />
        ) : (
          "Login"
        )} */}
      </div>
    </div>
  );
}

export default UserAccount;
