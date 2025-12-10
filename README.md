# Project API Next.js + Prisma + PostgreSQL

API sederhana menggunakan **Next.js**, **Prisma**, dan **PostgreSQL**.  
Project ini menyediakan endpoint untuk autentikasi (`login/register`) dan manajemen data siswa (`students`) serta pengguna (`users`).

## Teknologi

- [Next.js](https://nextjs.org/) – Framework React untuk frontend & API routes
- [Prisma](https://www.prisma.io/) – ORM untuk PostgreSQL
- [Vercel](https://vercel.com/) – Hosting serverless untuk Next.js API
- Node.js ≥ 18

---

## Setup Lokal

### 1. Clone repository

- ```bash
  git clone <repo-url>
  cd project-api-nextjs
  ```

### 2. Install Dependencies

- ```bash
  npm install
  ```

### 3. Environment Variables

- ```bash
  DATABASE_URL=postgresql://username:password@host:port/dbname
  JWT_SECRET=your_jwt_secret
  ```

### 4. Prisma Migration

- **Schema**

  ```json
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    password  String
    name      String
    role      UserRole @default(USER)
    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")

    @@map("users")
  }

  model Student {
    id            Int      @id @default(autoincrement())
    nim           String   @unique
    name          String
    address       String
    mathScore     Int?     @map("math_score")
    computerScore Int?     @map("computer_score")
    createdAt     DateTime @default(now()) @map("created_at")
    updatedAt     DateTime @updatedAt @map("updated_at")

    @@map("students")
  }

  enum UserRole {
    ADMIN
    USER
  }
  ```

- **Run Migration & Generate Client**

  ```bash
  npx prisma migrate dev
  npx prisma generate
  ```

## **5. Run Development Server**

- ```bash
  npm run dev
  ```
  **_default http://localhost:3000_**

---

# API Documentation

## Auth - Register

### Request

- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:**

  ```json
  {
    "name": "admin",
    "email": "admin@example.com",
    "password": "secret123",
    "role": "ADMIN"
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
      "name": "admin",
      "email": "admin@mail.com",
      "role": "ADMIN",
      "createdAt": "2025-12-09T14:07:48.485Z",
      "updatedAt": "2025-12-09T14:07:48.485Z"
    }
  }
  ```

### ❌ Error

- **Status:** `400 Bad Request`

  ```json
  {
    "status": false,
    "message": "Input anda tidak valid",
    "error": {
      "email": ["Email tidal valid"],
      "password": ["Password minimal 8 karakter"]
    },
    "code": 400
  }
  ```

## Auth - Login

### Request

- **Method:** `POST`
- **URL:** `/api/auth/login
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:**

  ```json
  {
    "email": "admin@example.com",
    "password": "secret123"
  }
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "status": true,
    "message": "Login Sukses",
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsImV4cCI6MTc2NTMwMzkxM30.ccsy9k4ZcvQqcpb8yJFW2t4X52SmT0_mgnJbeH0_UuY",
    "data": {
      "id": 1,
      "email": "admin@mail.com",
      "name": "admin",
      "role": "ADMIN",
      "createdAt": "2025-12-03T16:48:39.740Z",
      "updatedAt": "2025-12-03T16:48:39.740Z"
    }
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Email tidak ditemukan" / "Password anda salah",
    "code": 401
  }

  ```

## Users - ADD

### Request

- **Method:** `POST`
- **URL:** `/api/users`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Token <bearer>
  ```
- **Body:**

  ```json
  {
    "name": "superuser",
    "email": "superuser@example.com",
    "password": "secret123",
    "role": "ADMIN"
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
      "name": "admin",
      "email": "admin@mail.com",
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
    "error": "Unauthorized: Token Missing" / "Unauthorized : Invalid Token",
    "code": 401
  }
  ```

- **Status:** `403 Forbidden`

  ```json
  {
    "status": false,
    "error": "Forbidden: Admin access required",
    "code": 403
  }
  ```

- **Status:** `400 Bad Request`

  ```json
  {
    "status": false,
    "message": "Input anda tidak valid",
    "error": {
      "email": ["Email tidal valid"],
      "password": ["Password minimal 8 karakter"]
    },
    "code": 400
  }
  ```

## Users - Get All

### Request

- **Method:** `GET`
- **URL:** `/api/users`
- **Headers:**
  ```
  Authorization: Token <bearer>
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "success": true,
    "message": "Data Users didapatkan",
    "data": [
      {
        "id": 1,
        "name": "admin",
        "email": "admin@mail.com",
        "role": "ADMIN",
        "createdAt": "2025-12-03T16:48:39.740Z",
        "updatedAt": "2025-12-03T16:48:39.740Z"
      },
      {
        "id": 2,
        "name": "administrator",
        "email": "administrator@mail.com",
        "role": "ADMIN",
        "createdAt": "2025-12-09T14:07:48.485Z",
        "updatedAt": "2025-12-09T14:07:48.485Z"
      }
    ]
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Unauthorized: Token Missing" / "Unauthorized : Invalid Token",
    "code": 401
  }
  ```

- **Status:** `403 Forbidden`

  ```json
  {
    "status": false,
    "error": "Forbidden: Admin access required",
    "code": 403
  }
  ```

## Users - Get By ID

### Request

- **Method:** `GET`
- **URL:** `/api/users/[id]`
- **Params:** `[id]`
- **Headers:**
  ```
  Authorization: Token <bearer>
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "success": true,
    "message": "Data Users didapatkan",
    "data": {
      "id": 1,
      "name": "admin",
      "email": "admin@mail.com",
      "role": "ADMIN",
      "createdAt": "2025-12-03T16:48:39.740Z",
      "updatedAt": "2025-12-03T16:48:39.740Z"
    }
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Unauthorized: Token Missing",
    "code": 401
  }
  ```

- **Status:** `403 Forbidden`

  ```json
  {
    "status": false,
    "error": "Forbidden: Admin access required",
    "code": 403
  }
  ```

## Users - Update

### Request

- **Method:** `PUT`
- **URL:** `/api/users/[id]`
- **Params:** `[id]`
- **Headers:**

  ```
  Content-Type: application/json
  Authorization: Token <bearer>
  ```

  **Body:**

  ```json
  {
    "name": "John Doe",
    "email": "admin@example.com",
    "password": "anotherstring",
    "role": "ADMIN" / "USER"
  }
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "status": true,
    "message": "User berhasil diupdate",
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john@mail.com",
      "role": "ADMIN",
      "createdAt": "2025-12-03T16:48:39.740Z",
      "updatedAt": "2025-12-10T03:19:52.339Z"
    }
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Unauthorized: Token Missing",
    "code": 401
  }
  ```

- **Status:** `403 Forbidden`

  ```json
  {
    "status": false,
    "error": "Forbidden: Admin access required",
    "code": 403
  }
  ```

## Users - Delete

### Request

- **Method:** `DELETE`
- **URL:** `/api/users/[id]`
- **Params:** `[id]`
- **Headers:**

  ```
  Authorization: Token <bearer>
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "status": "success",
    "message": "User berhasil dihapus",
    "data": {
      "name": "yudha",
      "email": "yudha@mail.com"
    }
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Unauthorized: Token Missing",
    "code": 401
  }
  ```

- **Status:** `404 Not Found`

  ```json
  {
    "status": "false",
    "error": "ID User tidak ditemukan",
    "code": 404
  }
  ```

- **Status:** `403 Forbidden`

  ```json
  {
    "status": false,
    "error": "Forbidden: Admin access required",
    "code": 403
  }
  ```

## Students - ADD

### Request

- **Method:** `POST`
- **URL:** `/api/students`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Token <bearer>
  ```
- **Body:**

  ```json
  {
    "nim": "23450001" , //unique
    "name": "anton",
    "address": "blitar",
      ...
  }
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "status": true,
    "message": "Data Siswa berhasil ditambahkan",
    "data": {
      "id": 2,
      "nim": "23450001",
      "name": "anton",
      "address": "blitar",
      "mathScore": null,
      "computerScore": null,
      "createdAt": "2025-12-10T04:37:37.575Z",
      "updatedAt": "2025-12-10T04:37:37.575Z"
    }
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Unauthorized: Token Missing" / "Unauthorized : Invalid Token",
    "code": 401
  }
  ```

## Students - Get All

### Request

- **Method:** `GET`
- **URL:** `/api/students`
- **Headers:**
  ```
  Authorization: Token <bearer>
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "success": true,
    "message": "Data Siswa didapatkan",
    "data": [
      {
        "id": 1,
        "nim": "23450000",
        "name": "dewa",
        "address": "Semarang",
        "mathScore": 100,
        "computerScore": 100,
        "createdAt": "2025-12-09T16:32:46.599Z",
        "updatedAt": "2025-12-09T16:34:00.480Z"
      },
      {
        "id": 2,
        "nim": "23450001",
        "name": "anton",
        "address": "blitar",
        "mathScore": null,
        "computerScore": null,
        "createdAt": "2025-12-10T04:37:37.575Z",
        "updatedAt": "2025-12-10T04:37:37.575Z"
      },
      {
        "id": 3,
        "nim": "23450002",
        "name": "naruto",
        "address": "tokyo",
        "mathScore": null,
        "computerScore": null,
        "createdAt": "2025-12-10T05:02:04.144Z",
        "updatedAt": "2025-12-10T05:02:04.144Z"
      }
    ]
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Unauthorized: Token Missing" / "Unauthorized : Invalid Token",
    "code": 401
  }
  ```

- **Status:** `403 Forbidden`

## Student - Get By ID

### Request

- **Method:** `GET`
- **URL:** `/api/students/[id]`
- **Params:** `[id]`
- **Headers:**
  ```
  Authorization: Token <bearer>
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "status": true,
    "message": "Data siswa ditemukan",
    "data": {
      "id": 1,
      "nim": "23450000",
      "name": "dewa",
      "address": "Semarang",
      "mathScore": 100,
      "computerScore": 100,
      "createdAt": "2025-12-09T16:32:46.599Z",
      "updatedAt": "2025-12-09T16:34:00.480Z"
    }
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Unauthorized: Token Missing",
    "code": 401
  }
  ```

## Student - Update

### Request

- **Method:** `PUT`
- **URL:** `/api/students/[id]`
- **Params:** `[id]`
- **Headers:**

  ```
  Content-Type: application/json
  Authorization: Token <bearer>
  ```

  **Body:**

  ```json
  {  ...
    "mathScore": 100,
    "computerScore": 100
     ...
  }
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "status": true,
    "message": "Data siswa berhasil diupdate",
    "data": {
      "id": 2,
      "nim": "23450001",
      "name": "anton",
      "address": "blitar",
      "mathScore": 100,
      "computerScore": 100,
      "createdAt": "2025-12-10T04:37:37.575Z",
      "updatedAt": "2025-12-10T06:02:26.562Z"
    }
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Unauthorized: Token Missing" / "Unauthorized : Invalid Token",
    "code": 401
  }
  ```

- **Status:** `403 Forbidden`

## Student - Delete

### Request

- **Method:** `DELETE`
- **URL:** `/api/students/[id]`
- **Params:** `[id]`
- **Headers:**

  ```
  Authorization: Token <bearer>
  ```

### ✅ Response

- **Status:** `200 OK`

  ```json
  {
    "status": true,
    "message": "Student berhasil dihapus",
    "data": {
      "nim": "23450002",
      "name": "naruto"
    }
  }
  ```

### ❌ Error

- **Status:** `401 Unauthorized`

  ```json
  {
    "status": false,
    "error": "Unauthorized: Token Missing",
    "code": 401
  }
  ```

- **Status:** `404 Not Found`

  ```json
  {
    "status": "false",
    "error": "ID User tidak ditemukan",
    "code": 404
  }
  ```

- **Status:** `403 Forbidden`

  ```json
  {
    "status": false,
    "error": "Forbidden: Admin access required",
    "code": 403
  }
  ```
