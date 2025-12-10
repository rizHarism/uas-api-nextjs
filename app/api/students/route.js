import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

// GET ambil semua data students
export async function GET() {
  try {
    const students = await prisma.student.findMany();
    return NextResponse.json(
      {
        success: true,
        message: "Data Siswa didapatkan",
        data: students,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error GET all students: ", error);
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

export async function POST(req) {
  try {
    const data = await req.json();
    const newStudent = await prisma.student.create({
      data: data,
    });

    return NextResponse.json({
      status: true,
      message: "Data Siswa berhasil ditambahkan",
      data: newStudent,
    });
  } catch (error) {
    console.log("Error Add Students: ", error);
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
