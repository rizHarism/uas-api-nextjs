# Project API Next.js + Prisma + Supabase

API sederhana menggunakan **Next.js**, **Prisma**, dan **Supabase Postgres**.  
Project ini menyediakan endpoint untuk autentikasi (`login/register`) dan manajemen data siswa (`students`) serta pengguna (`users`).

## Teknologi

- [Next.js](https://nextjs.org/) – Framework React untuk frontend & API routes
- [Prisma](https://www.prisma.io/) – ORM untuk PostgreSQL
- [Supabase](https://supabase.com/) – Database Postgres
- [Vercel](https://vercel.com/) – Hosting serverless untuk Next.js API
- Node.js ≥ 18

## Setup Lokal

**1. Clone repository**

```bash
git clone <repo-url>
cd project-api-nextjs
```

**2. Install Dependencies**

```bash
npm install
```

**3. Environment Variables**

```bash
DATABASE_URL=postgresql://username:password@host:port/dbname
JWT_SECRET=your_jwt_secret
```

**4. Prisma Migration**

```bash
npx prisma migrate dev
npx prisma generate
```

**5. Run Development Server**

```bash
npm run dev
# default http://localhost:3000
```

# API Reference

## Auth - Register

### Request

- **Method:** `POST`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:**

  ```json
  {
    "email": "user@example.com",
    "password": "secret123"
  }
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "status": true,
    "message": "User berhasil dibuat",
    "data": {
      "id": 2,
      "name": "administrator",
      "email": "administrator@mail.com",
      "role": "ADMIN",
      "createdAt": "2025-12-09T14:07:48.485Z",
      "updatedAt": "2025-12-09T14:07:48.485Z"
    }
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Email tidak ditemukan",
    "code": 401
  }
  ```

  ```json
  {
    "status": false,
    "error": "Password anda salah",
    "code": 401
  }
  ```
