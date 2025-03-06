import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {
  CustomNextResponse,
  NextResponse_CatchError,
  NextResponse_NoCookie,
  NextResponse_NoEnv,
  NextResponse_NotAdmin,
} from "@/app/_utils/NextResponses";
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
  if (!process.env.ACCESS_TOKEN) {
    return CustomNextResponse(
      false,
      "NO_ENV",
      "Серверийн тохиргооны алдаа",
      null
    );
  }
  const cookie = req.cookies.get("accessToken");
  const accessToken = cookie?.value;
  if (!accessToken) {
    return CustomNextResponse(
      false,
      "USER_NOT_SIGNED_IN",
      "Хэрэглэгч нэвтрээгүй байна!",
      null
    );
  }
  try {
    const verify = jwt.verify(accessToken, process.env.ACCESS_TOKEN) as {
      role: string;
    };
    if (!verify) {
      return CustomNextResponse(
        false,
        "TOKEN_EXPIRED",
        "Token хугацаа дууссан байна",
        null
      );
    }
    if (verify.role !== "ADMIN") {
      return CustomNextResponse(
        false,
        "UNAUTHERIZED",
        "Админ биш байна!",
        null
      );
    }
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
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  console.log(id);
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!id) {
    return CustomNextResponse(
      false,
      "NO_INFO_PROVIDED",
      "Категорь таних тэмдэг илгээгүй байна!",
      null
    );
  }
  if (!process.env.ACCESS_TOKEN) {
    return NextResponse_NoEnv();
  }
  if (!accessToken) {
    return NextResponse_NoCookie();
  }
  try {
    const verify = jwt.verify(accessToken, process.env.ACCESS_TOKEN) as {
      role: string;
    };
    if (verify.role !== "ADMIN") {
      return NextResponse_NotAdmin();
    }
    console.log("step 1");
    const category = await prisma.foodCategory.findUnique({ where: { id } });

    if (category) {
      console.log("step 2");

      const deleteAllFoods = await prisma.foods.deleteMany({
        where: { categoryId: category.id },
      });
      console.log("step 3");

      const deleteCategory = await prisma.foodCategory.delete({
        where: { id: category.id },
      });
      console.log("step 4");

      if (deleteAllFoods && deleteCategory) {
        return CustomNextResponse(
          true,
          "CATEGORY_DELETED_SUCCESSFULLY",
          "Категорийг амжилттай устгалаа!",
          { foods: deleteAllFoods, category: deleteCategory }
        );
      }
      return CustomNextResponse(
        false,
        "SOMETHING_WENT_WRONG",
        "Амжилтгүй боллоо",
        null
      );
    }
  } catch (err) {
    console.error(err, "Сервер дээр асуудал гарлаа!");
    return NextResponse_CatchError(err);
  }
}
