import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const userSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidal valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

// GET ambil semua data user
export async function GET() {
  try {
    const users = await prisma.user.findMany({
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
        success: true,
        message: "Data Users didapatkan",
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error GET all User: ", error);
    return NextResponse.json(
      {
        status: false,
        error: "Error Server",
        code: 500,
      },
      { status: 500 }
    );
  }
}

// POST menambah data user
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
    console.log("Error Add User: ", error);
    return NextResponse.json(
      {
        status: false,
        error: "Error Server",
        code: 500,
      },
      { status: 500 }
    );
  }
}
