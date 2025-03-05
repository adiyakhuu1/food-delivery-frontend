import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
  } catch (err) {
    console.error(err, "Сервэрийн алдаа");
    return NextResponse.json({
      success: false,
      message: "Сервэрт асуудал гарлаа!",
      code: "ERROR_IN_THE_SERVER",
      data: null,
    });
  }
}
