import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      code: "USER_LOGGED_OUT",
      message: "Хэрэглэгч амжилттай гарлаа",
      data: null,
    });

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 0,
    });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 0,
    });
    return response;
  } catch (err) {
    console.error(err, "Хүсэлт ажилтгүй боллоо.");
    return NextResponse.json({
      success: false,
      code: "SERVER_ERROR",
      message: "Хүсэлт ажилтгүй боллоо.",
      data: null,
    });
  }
}
