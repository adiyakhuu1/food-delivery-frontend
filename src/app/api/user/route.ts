import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prismadb";
export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("refreshToken");
    const refreshToken = cookie?.value;
    if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
      return NextResponse.json({
        success: false,
        code: "ENV_SETTINGS_ERROR",
        message: "Серверийн тохиргооны алдаа. (ENV)",
        data: null,
      });
    }
    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Token хугацаа дууссан байна.",
        data: null,
      });
    }
    const verify = jwt.verify(refreshToken, process.env.REFRESH_TOKEN) as {
      id: string;
    };

    if (!verify) {
      return NextResponse.json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Token хугацаа дууссан байна.",
        data: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: verify.id,
      },
      include: {
        orderedFoods: {
          include: {
            foodOrderItems: {
              include: {
                food: true,
              },
            },
            user: true,
          },
        },
      },
    });
    if (!user) {
      const response = NextResponse.json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "Хэрэглэгч олдсонгүй",
        data: null,
      });
      response.cookies.set("accessToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1,
      });
      response.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1,
      });
      return response;
    }
    const newRefreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_TOKEN,
      { expiresIn: "4h" }
    );
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30m" }
    );
    const { password, ...userInfo } = user;
    const response = NextResponse.json({
      success: true,
      message: "Амжилттай",
      code: "TOKEN_REFRESHED_SUCCESSFULLY",
      data: { userInfo },
    });
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 4,
    });
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60,
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
