import axios, { AxiosInstance } from "axios";
import base64url from "base64url";

// Helper function to extract the JWT from the session cookie
export const extractJwtFromSession = (sessionCookie: string): string | null => {
  try {
    const decoded = base64url.decode(sessionCookie);
    const sessionData = JSON.parse(decoded);
    return sessionData.jwt || null;
  } catch (error: any) {
    console.error("Failed to extract JWT from session cookie:", error?.message);
    return null;
  }
};

export const buildClient = (): AxiosInstance => {
  let headers: Record<string, string | undefined> = {
    "Content-Type": "application/json",
    Host: process.env.HOST_NAME || "recipe.dev",
  };

  if (typeof window === "undefined") {
    ("use server");
    // Server-side logic
    const { cookies } = require("next/headers"); // Dynamically import to avoid client-side issues
    const allCookies = cookies();
    const sessionCookie = allCookies.get("session")?.value;
    const jwt = sessionCookie ? extractJwtFromSession(sessionCookie) : null;

    headers.Cookie = sessionCookie ? `session=${sessionCookie}` : undefined;
    headers.Authorization = jwt ? `Bearer ${jwt}` : undefined;

    const url =
      "http://envoy-gateway-food-app.envoy-gateway-system.svc.cluster.local";

    return axios.create({
      baseURL: process.env.NODE_ENV === "production" ? "/" : url,
      headers,
    });
  } else {
    // Client-side logic
    console.log(document.cookie);
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];
    const jwt = sessionCookie ? extractJwtFromSession(sessionCookie) : null;

    console.log("Session cookie:", sessionCookie);

    headers.Authorization = jwt ? `Bearer ${jwt}` : undefined;

    return axios.create({
      baseURL: "/",
      headers,
    });
  }
};
