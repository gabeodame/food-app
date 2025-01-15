import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

export const buildClient = (): AxiosInstance => {
  console.log("Building client...");
  const allCookies = cookies(); // Access all cookies
  const sessionCookie = allCookies.get("session")?.value; // Get the session cookie

  console.log("sessionCookie:", sessionCookie);

  const headers = {
    "Content-Type": "application/json",
    Host: process.env.HOST_NAME || "recipe.dev",
    Authorization: sessionCookie ? `Bearer ${sessionCookie}` : undefined, // Pass session cookie explicitly
  };

  console.log("Authorization Header:", headers);
  if (typeof window === "undefined") {
    // Server-side
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers,
    });
  } else {
    // Client-side
    return axios.create({
      baseURL: "/",
      headers,
    });
  }
};
