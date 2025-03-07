import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
// import [objectId] from 'mongodb'
import jwt from "jsonwebtoken";
import {
  CustomNextResponse,
  NextResponse_CatchError,
  NextResponse_NoCookie,
  NextResponse_NoEnv,
  NextResponse_NotAdmin,
  NextResponse_TokenExpired,
} from "@/app/_utils/NextResponses";
import { NextApiRequest } from "next";
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
    const { foodName, price, image, ingredients, category } = await req.json();
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
      data: { foodName, price, ingredients, image, categoryId: catname?.id },
    });

    if (newCategory) {
      return NextResponse.json({
        success: true,
        code: "REQUEST_SUCCESS",
        message: "Хоол амжилттай нэмэгдлээ!",
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
      message: err instanceof Error ? err.message : String(err),
      code: "ERROR_IN_THE_SERVER",
      data: null,
    });
  }
}
export async function PATCH(req: NextRequest) {
  const { foodName, price, ingredients, category, image, foodId } =
    await req.json();
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!process.env.ACCESS_TOKEN) {
    return NextResponse_NoEnv("ACCESS_TOKEN");
  }
  if (!accessToken) {
    return NextResponse_NoCookie();
  }
  try {
    const verify = jwt.verify(accessToken, process.env.ACCESS_TOKEN) as {
      role: string;
    };
    if (!verify) {
      return NextResponse_TokenExpired();
    }
    if (verify.role !== "ADMIN") {
      return NextResponse_NotAdmin();
    }
    const catName = await prisma.foodCategory.findFirst({
      where: {
        id: category,
      },
    });
    if (!catName) {
      return CustomNextResponse(
        false,
        "CATEGORY_NOT_FOUND",
        "Категори олдонгүй!",
        null
      );
    }
    const updateFood = await prisma.foods.update({
      where: {
        id: foodId,
      },
      data: {
        foodName,
        price,
        ingredients,
        categoryId: catName.id,
        image,
      },
    });
    if (updateFood) {
      return CustomNextResponse(
        true,
        "FOOD_INFO_UPDATED",
        "Хоолны мэдээлэл амжилттай өөрчлөгдлөө",
        null
      );
    }
    return CustomNextResponse(
      false,
      "FOOD_NOT_UPDATED",
      "Хоол мэдээллийг өөрчлөж чадсангүй!",
      null
    );
  } catch (err) {
    console.error(err, "Сервэр дээр асуудал гарлаа!");
    return NextResponse_CatchError(err);
  }
}
export async function DELETE(req: NextRequest) {
  // const id = req.query;
  const url = req.nextUrl.searchParams.get("id");
  if (!url) {
    return CustomNextResponse(
      false,
      "NO_FOOD_ID_PROVIDED",
      "Хоолны таних тэмдгийг илгээгээгүй байна!",
      null
    );
  }
  if (!process.env.ACCESS_TOKEN) {
    return NextResponse_NoEnv("ACCESS_TOKEN");
  }
  const accessToken = req.cookies.get("accessToken")?.value;
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
    const item = await prisma.foods.findUnique({
      where: { id: url },
    });
    if (!item) {
      CustomNextResponse(false, "FOOD_NOT_FOUND", "Хоол олдсонгүй", null);
    }

    const DeletedItem = await prisma.foods.delete({
      where: {
        id: item?.id,
      },
    });
    return CustomNextResponse(
      true,
      "FOOD_DELETED_SUCCESSFULLY",
      "Хоол амжилттай устлаа!",
      { DeletedItem }
    );
    // const item = await prisma.foods.delete({
    //   where: { id: url },
    // });
  } catch (err) {
    console.error(err, "Сервер дээр асуудал гарлаа!");
    return NextResponse_CatchError(err);
  }

  return CustomNextResponse(true, "TESTING", "Туршилт", null);
}
