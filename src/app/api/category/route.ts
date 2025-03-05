import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.foodCategory.findMany({
      include: { Foods: true },
    });
    if (categories) {
      return NextResponse.json({
        success: true,
        code: "REQUEST_SUCCESS",
        message: "Хүсэл амжилттай",
        data: { categories },
      });
    }
    return NextResponse.json({
      success: false,
      code: "CATEGORIES_NOT_FOUND",
      message: "Категори олдсонгүй",
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
  const { name } = await req.json();
  try {
    const check = await prisma.foodCategory.findFirst({
      where: { name },
    });
    if (check) {
      return NextResponse.json({
        success: true,
        code: "CATEGORY_EXISTS",
        message: "Категори датабазд байна.",
        data: { food: check },
      });
    }
    const newCategory = await prisma.foodCategory.create({
      data: { name },
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
      message: "Категори Нэмж чадсангүй",
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
