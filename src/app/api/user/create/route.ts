import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!process.env.SALT) {
    return NextResponse.json({
      success: false,
      message: "Серверийн тохиргооны алдаа (ENV)",
      code: "NO_ENV",
      data: null,
    });
  }
  try {
    const userExist = await prisma.user.findFirst({
      where: { email },
    });
    if (!userExist) {
      const encryptedPass = await bcrypt.hash(
        password,
        Number(process.env.SALT)
      );
      const newUser = await prisma.user.create({
        data: {
          email,
          password: encryptedPass,
        },
      });
      if (newUser) {
        return NextResponse.json({
          success: true,
          message: "Хэрэглэгч амжилттай бүртгүүллээ!",
          code: "USER_CREATED_SUCCESSFULLY",
          data: {
            id: newUser.id,
          },
        });
      }
    }
    return NextResponse.json({
      success: false,
      message: "Хэрэглэгч бүртгэлтэй байна!",
      code: "USER_EXISTS",
      data: null,
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
