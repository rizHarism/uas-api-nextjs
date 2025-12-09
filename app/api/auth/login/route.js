import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { RateLimiterMemory } from "rate-limiter-flexible";

// cek untuk rate limiter
const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 15 * 60, // 15 menit
});

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
    const key = `${email}:${ip}`;

    try {
      await rateLimiter.consume(key);
    } catch (rateLimitError) {
      const retrySeconds = Math.ceil(rateLimitError.msBeforeNext / 1000);

      return NextResponse.json(
        {
          status: false,
          error: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit",
          code: 429,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retrySeconds.toString(),
          },
        }
      );
    }

    // get user data dari db dengan email (unique)
    const user = await prisma.user.findUnique({ where: { email: email } });

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
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
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
