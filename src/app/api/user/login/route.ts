import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prismadb";
import jwt from "jsonwebtoken";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
    return NextResponse.json({
      success: false,
      message: "Серверийн тохиргооны алдаа (ENV)",
      code: "ENV_SETTINGS_ERROR",
      data: null,
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Хэрэглэгч бүртгэлгүй байна!",
        code: "USER_NOT_FOUND",
        data: null,
      });
    }
    const verifypass = await bcrypt.compare(password, user.password);
    if (!verifypass) {
      return NextResponse.json({
        success: false,
        message: "Хэрэглэгчийн нууц үг буруу байна!",
        code: "INCORRECT_PASSWORD",
        data: null,
      });
    }
    const response = NextResponse.json({
      success: true,
      message: "Тавтай морил!",
      code: "LOGGED_IN_SUCCESSFULLY",
      data: {
        id: user.id,
      },
    });
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN, {
      expiresIn: "4h",
    });
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60,
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 4,
    });
    return response;
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
