import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidal valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

export async function POST(req) {
  try {
    const data = await req.json();
    const validation = userSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        {
          status: false,
          message: "Input anda tidak valid",
          error: validation.error.flatten().fieldErrors,
          code: 400,
        },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(
      {
        status: true,
        message: "User berhasil dibuat",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error GET User: ", error);
    return NextResponse.json(
      {
        status: false,
        error: "server error",
        code: 500,
      },
      { status: 500 }
    );
  }
}
