import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prismadb";
import { FoodOrderItem } from "@prisma/client";
import { CustomCategory } from "@/app/_components/_reusable/user-food-card";
import { Order } from "@/app/_components/home-navigations";
import {
  CustomNextResponse,
  NextResponse_CatchError,
  NextResponse_NoCookie,
  NextResponse_NoEnv,
} from "@/app/_utils/NextResponses";
export async function POST(req: NextRequest) {
  const { totalPrice, foodOrderItems, status } = await req.json();
  const cookie = req.cookies.get("accessToken");
  const accessToken = cookie?.value;
  if (!process.env.ACCESS_TOKEN) {
    return NextResponse.json({
      success: false,
      code: "ENV_SETTINGS_ERROR",
      message: "Серверийн тохиргооны алдаа. (ENV)",
      data: null,
    });
  }

  if (!accessToken) {
    return NextResponse.json({
      success: false,
      message: "Хэрэглэгч эхлээд нэвтрэх ёстой!",
      code: "USER_NOT_SIGNED_IN",
      data: null,
    });
  }

  try {
    const verify = jwt.verify(accessToken, process.env.ACCESS_TOKEN) as {
      id: string;
    };
    if (!verify) {
      return NextResponse.json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Token хугацаа дууссан байна. Ахин нэвтэрнэ үү!",
        data: null,
      });
    }
    const newItems = foodOrderItems.map((item: Order) => {
      const { food, ...other } = item;
      return {
        ...other,
      };
    });
    const newOrder = await prisma.foodOrder.create({
      data: {
        totalPrice,
        foodOrderItems: {
          create: newItems,
        },
        userId: verify.id,
      },
    });

    if (newOrder) {
      const user = await prisma.user.findUnique({
        where: { id: verify.id },
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
      if (user) {
        const { password, ...userInfo } = user;
        return NextResponse.json({
          success: true,
          code: "ORDER_PLACED_SUCCESSFULLY",
          message: "Захиалга амжилттай!",
          data: {
            userInfo,
          },
        });
      }
    }
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
export async function GET(req: NextRequest) {
  if (!process.env.ACCESS_TOKEN) {
    return NextResponse_NoEnv("ACCESS_TOKEN");
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse_NoCookie();
  }

  try {
    const verify = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    const allOrder = await prisma.foodOrder.findMany({
      include: { user: true },
    });
    if (allOrder) {
      return CustomNextResponse(
        true,
        "REQUEST_SUCCESS",
        "Хоолыг амжиллаа татлаа!",
        { allOrder }
      );
    }
    return CustomNextResponse(
      false,
      "NO_FOODORDERS_FOUND",
      "Хоолны захиалга байхгүй байна!",
      null
    );
  } catch (err) {
    console.error(err, "Сервэр дээр асуудал гарлаа!");
    return NextResponse_CatchError(err);
  }
}
