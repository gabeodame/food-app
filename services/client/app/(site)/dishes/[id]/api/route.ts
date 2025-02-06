import { NextResponse } from "next/server";
import axios from "axios";

import { cookies } from "next/headers";
import { extractJwtFromSession } from "@/app/util/buildClient";

// ✅ API Route Handler
export async function GET() {
  try {
    // 🔹 Get cookies from Next.js request headers
    const allCookies = cookies();
    const sessionCookie = allCookies.get("session")?.value;
    const jwt = sessionCookie ? extractJwtFromSession(sessionCookie) : null;

    // 🔹 Define request headers
    const headers: Record<string, string | undefined> = {
      "Content-Type": "application/json",
      Host: process.env.HOST_NAME || "recipe.dev",
      Cookie: sessionCookie ? `session=${sessionCookie}` : undefined,
      Authorization: jwt ? `Bearer ${jwt}` : undefined,
    };

    // 🔹 Fetch recipes from the internal API
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/1/recipes?limit=50`,
      { headers }
    );

    // 🔹 Return response data
    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Error fetching recipes:", error?.message);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
