import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prismadb";
import { CustomNextResponse } from "@/app/_utils/NextResponses";
export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("refreshToken");
    const refreshToken = cookie?.value;
    if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
      return CustomNextResponse(
        false,
        "ENV_SETTINGS_ERROR",
        "Серверийн тохиргооны алдаа. (ENV)",
        null
      );
    }
    if (!refreshToken) {
      return CustomNextResponse(
        false,
        "TOKEN_EXPIRED",
        "Token хугацаа дууссан байна.",
        null
      );
    }
    const verify = jwt.verify(refreshToken, process.env.REFRESH_TOKEN) as {
      id: string;
    };

    if (!verify) {
      return CustomNextResponse(
        false,
        "TOKEN_EXPIRED",
        "Token хугацаа дууссан байна.",
        null
      );
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
      const response = CustomNextResponse(
        false,
        "USER_NOT_FOUND",
        "Хэрэглэгч олдсонгүй",
        null
      );

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
      { id: user.id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30m" }
    );
    const { password, ...userInfo } = user;
    // const response = NextResponse.json({
    //   success: true,
    //   message: "Амжилттай",
    //   code: "TOKEN_REFRESHED_SUCCESSFULLY",
    //   data: { userInfo },
    // });
    const response = CustomNextResponse(
      true,
      "TOKEN_REFRESHED_SUCCESSFULLY",
      "Амжилттай",
      { userInfo }
    );
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

    return CustomNextResponse(
      false,
      "Сервэрт асуудал гарлаа!",
      "ERROR_IN_THE_SERVER",
      null
    );
  }
}
