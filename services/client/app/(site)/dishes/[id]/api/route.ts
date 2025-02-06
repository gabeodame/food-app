import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  try {
    if (!id) {
      return;
    }
    const res = await fetch(`/api/1/recipes/${+id}`);
    const { data } = await res.json();

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data }, { status: 100 });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      NextResponse.json({ error }, { status: 500 });
    }
  }
}
