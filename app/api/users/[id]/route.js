import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { email } from "zod";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        {
          status: false,
          error: "ID tidak valid",
          code: 400,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          status: false,
          error: "user tidak ditemukan",
          code: 401,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "user ditemukan",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error GET User: ", error);
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

export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const data = await req.json();

    const userExist = await prisma.user.findUnique({ where: { id: id } });

    if (!userExist) {
      return NextResponse.json(
        {
          status: false,
          error: "ID User tidak ditemukan",
          code: 404,
        },
        { status: 404 }
      );
    }

    const updateData = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    } else {
      delete updateData.password;
    }

    const updateUser = await prisma.user.update({
      where: { id: id },
      data: updateData,
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
        message: "User berhasil diupdate",
        data: updateUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        error: "Server Error",
        code: 500,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const userExist = await prisma.user.findUnique({ where: { id: id } });

    if (!userExist) {
      return NextResponse.json(
        {
          status: "false",
          error: "ID User tidak ditemukan",
          code: 404,
        },
        { status: 404 } // 404 Not Found lebih tepat
      );
    }

    const deletedUser = await prisma.user.delete({
      where: { id: id },
      select: {
        name: true,
        email: true,
      },
    });
    return NextResponse.json(
      {
        status: "success",
        message: "User berhasil dihapus",
        data: deletedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        error: "Server Error",
        code: 500,
      },
      { status: 500 }
    );
  }
}
