import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: id },
    });

    if (!student) {
      return NextResponse.json(
        {
          status: false,
          error: "Siswa tidak ditemukan",
          code: 401,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: "Data siswa ditemukan",
        data: student,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error GET Student: ", error);
    return NextResponse.json(
      {
        status: false,
        message: "Error Server",
        code: 500,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const data = await req.json();

  const studentExists = await prisma.student.findUnique({
    where: { id: id },
  });

  if (!studentExists) {
    return NextResponse.json(
      {
        status: false,
        message: "ID siswa tidak ditemukan",
        code: 404,
      },
      { status: 404 }
    );
  }

  const updateStudent = await prisma.student.update({
    where: { id: id },
    data: data,
  });
  return NextResponse.json(
    {
      status: true,
      message: "Data siswa berhasil diupdate",
      data: updateStudent,
    },
    { status: 200 }
  );
}

export async function DELETE(req, { params }) {
  try {
    const userRole = req.headers.get("x-user-role");

    if (userRole !== "ADMIN") {
      return Response.json(
        {
          status: false,
          error: "Unauthorized: Role anda bukan admin",
          code: 403,
        },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const studentExists = await prisma.student.findUnique({
      where: { id: id },
    });

    if (!studentExists) {
      return NextResponse.json(
        {
          status: false,
          message: "ID siswa tidak ditemukan",
          code: 404,
        },
        { status: 404 }
      );
    }

    const deletedStudent = await prisma.student.delete({
      where: { id: id },
    });

    return NextResponse.json(
      {
        status: true,
        message: "Student berhasil dihapus",
        data: deletedStudent,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Server Database Error",
        code: 500,
      },
      { status: 500 }
    );
  }
}
