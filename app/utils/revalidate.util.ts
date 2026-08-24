import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    // Lấy token từ Headers mà Backend gửi sang
    const secret = request.headers.get("x-revalidate-secret");

    // Kiểm tra bảo mật
    if (secret !== process.env.REVALIDATE_SECRET_TOKEN) {
      return NextResponse.json(
        { message: "Invalid secret token" },
        { status: 401 },
      );
    }

    // Đọc dữ liệu body
    const body = await request.json();
    const tag = body.tag;

    if (!tag) {
      return NextResponse.json(
        { message: "Missing tag in body" },
        { status: 400 },
      );
    }

    // Kích hoạt phá Cache
    revalidateTag(tag, "default");

    return NextResponse.json({
      revalidated: true,
      tag: tag,
      now: Date.now(),
    });
  } catch (error) {
    console.error("[FE Revalidate Error]", error);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
