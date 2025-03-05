import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
// import [objectId] from 'mongodb'

export async function GET() {
  try {
    const foods = await prisma.foods.findMany({
      include: {
        category: true,
      },
    });
    if (foods) {
      return NextResponse.json({
        success: true,
        code: "REQUEST_SUCCESS",
        message: "Хүсэл амжилттай",
        data: { foods },
      });
    }
    return NextResponse.json({
      success: false,
      code: "FOODS_NOT_FOUND",
      message: "Хоол олдсонгүй",
      data: {},
    });
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
export async function POST(req: NextRequest) {
  try {
    const { foodName, price, ingredients, category } = await req.json();

    const check = await prisma.foods.findFirst({
      where: { foodName },
    });
    if (check) {
      return NextResponse.json({
        success: true,
        code: "FOODS_EXISTS",
        message: "Хоол датабазд байна.",
        data: { food: check },
      });
    }

    const catname = await prisma.foodCategory.findFirst({
      where: { name: category },
    });
    if (!catname) {
      return NextResponse.json({
        success: false,
        code: "FAILED",
        message: "Хоол Нэмж чадсангүй",
        data: {},
      });
    }
    const newCategory = await prisma.foods.create({
      data: { foodName, price, ingredients, categoryId: catname?.id },
    });

    if (newCategory) {
      return NextResponse.json({
        success: true,
        code: "REQUEST_SUCCESS",
        message: "Хүсэл амжилттай",
        data: { newCategory },
      });
    }

    return NextResponse.json({
      success: false,
      code: "FAILED",
      message: "Хоол Нэмж чадсангүй",
      data: {},
    });
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
