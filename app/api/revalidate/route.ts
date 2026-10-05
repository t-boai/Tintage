import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-revalidate-secret");

    if (secret !== process.env.REVALIDATE_SECRET_TOKEN) {
      return NextResponse.json(
        { message: "Invalid secret token" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const tags = body.tags || (body.tag ? [body.tag] : []);

    if (tags.length === 0) {
      return NextResponse.json(
        { message: "Missing tags in body" },
        { status: 400 },
      );
    }

    for (const tagToClear of tags) {
      revalidateTag(tagToClear, "default");
      console.log(`Next.js Revalidate: Đã xóa cache: ${tagToClear}`);
    }

    return NextResponse.json({
      revalidated: true,
      tags: tags,
      now: Date.now(),
    });
  } catch (error) {
    console.error("FE Revalidate Error: ", error);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
