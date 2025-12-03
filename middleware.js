import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          status: false,
          error: "Unauthorized: Token Missing",
          code: 401,
        },
        { status: 401 }
      );
    }

    // ambil cek token dan ambil payload
    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    // tambah isian header dari payload
    const headers = new Headers(req.headers);
    headers.set("x-user-role", payload.role);

    //  /api/users/* hanya untuk role 'admin'
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/api/users") && payload.role !== "ADMIN") {
      return NextResponse.json(
        {
          status: false,
          error: "Forbidden: Admin access required",
          code: 403,
        },
        { status: 403 }
      );
    }

    // kirim header ke api tujuan
    return NextResponse.next({
      request: { headers },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: false,
        error: "Unauthorized : Invalid Token",
        code: 401,
      },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/students/:path*", "/api/users/:path*"],
};
