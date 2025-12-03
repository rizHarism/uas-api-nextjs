import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";

    const isLimited = await limiter.check(5, `login:${email}:${ip}`);

    if (isLimited) {
      return NextResponse.json(
        {
          status: false,
          error: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit.",
          code: 429, // Status code rate limit
        },
        {
          status: 429,
          headers: {
            "Retry-After": "900", // 15 menit dalam detik
          },
        }
      );
    }

    // get user data dari db dengan email (unique)
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        {
          status: false,
          error: "Email tidak ditemukan",
          code: 401,
        },
        { status: 401 }
      );
    }

    // cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          status: false,
          error: "Password anda salah",
          code: 401,
        },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2H")
      .sign(secret);

    return NextResponse.json({
      status: true,
      message: "login Sukses",
      token: token,
      data: user,
    });
  } catch (error) {
    console.error("Error Login: ", error);
    return NextResponse.json(
      {
        status: false,
        error: "Error Server Login",
        code: 500,
      },
      { status: 500 }
    );
  }
}
