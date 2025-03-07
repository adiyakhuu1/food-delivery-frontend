import {
  CustomNextResponse,
  NextResponse_CatchError,
  NextResponse_NoEnv,
} from "@/app/_utils/NextResponses";
import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export async function GET() {
  return NextResponse.json({ message: "?" });
}
export async function POST(req: NextRequest) {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    await prisma.oTP.deleteMany({
      where: { createdAt: { lt: tenMinutesAgo } },
    });
    const { email } = await req.json();
    if (!email) {
      return CustomNextResponse(
        false,
        "NO_EMAIL_PROVIDED",
        "Емайл олдсонгүй",
        null
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return CustomNextResponse(
        false,
        "USER_NOT_FOUND",
        "Хэрэглэгч бүртгэлгүй байна!",
        null
      );
    }
    const OTP = Number(Math.round(Math.random() * 89000 + 11000));
    await transporter.sendMail({
      from: "Adiyakhuu", // sender address
      to: email, // list of receivers
      subject: "Нууц үг солих нэг удаагийн код", // Subject line
      text: "Adiyakhuu | Food-Delivery Clone Project", // plain text body
      html: `<b>Сайн байна уу!</b><p> Таны нэг удаагийн нууц код: ${OTP}</p></b><strong>Уг код 10хан минут хүчинтэй!</strong>`, // html body
    });
    const newOTP = await prisma.oTP.create({
      data: { email, userId: user.id, OTP },
    });
    if (newOTP) {
      return CustomNextResponse(
        true,
        "OTP_SET",
        "Нэг удаагийн код амжилттай явлаа! Илгээсэн код, 10хан минут хүчинтэй!",
        { id: newOTP.id }
      );
    }
    return CustomNextResponse(
      false,
      "OTP_SET_FAILED",
      "Нэг удаагийн код явуулж чадсангүй!",
      null
    );
  } catch (err) {
    console.error(err, "Сервер дээр асуудал гарлаа");
    return NextResponse_CatchError(err);
  }
}
export async function PATCH(req: NextRequest) {
  const { OTP, email, OTPID, password } = await req.json();

  if (!process.env.SALT) {
    return NextResponse_NoEnv("SALT");
  }
  try {
    if (!OTP && !email && !OTPID && !password) {
      return CustomNextResponse(
        false,
        "LACK_OF_INFO",
        "Мэдээлэл дутуу байна!",
        null
      );
    }

    const otp = await prisma.oTP.findUnique({ where: { id: OTPID } });

    if (!otp) {
      return CustomNextResponse(
        false,
        "OTP_NOT_FOUND",
        "Нэг удаагийн олдсонгүй эсвэл хүчингүй!",
        null
      );
    }
    if (OTP === otp.OTP && email === otp.email && OTPID === otp.id) {
      const encryptedPass = await bcrypt.hash(
        password,
        Number(process.env.SALT)
      );

      const user = await prisma.user.update({
        where: { email },
        data: { password: encryptedPass },
      });
      if (!user) {
        return CustomNextResponse(
          false,
          "USER_NOT_FOUND",
          "Хэрэглэгч олдсонгүй!",
          {}
        );
      }
      return CustomNextResponse(
        true,
        "OTP_MATCHED",
        "Нэг удаагийн нууц код таарч байна! Нууц үг амжилттай солигдлаа!",
        {}
      );
    }
    return CustomNextResponse(
      false,
      "OTP_NOT_MATCHED",
      "Нэг удаагийн нууц код таарсангүй!",
      {}
    );
  } catch (err) {
    console.error(err, "Сервер дээр асуудал гарлаа!");
    return NextResponse_CatchError(err);
  }
}
