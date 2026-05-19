# NestJS_Prisma_Tamplate

This is a full-stack project with a NestJS backend and (planned) NextJS frontend.

## Tech Stack & Packages

This template is built with modern tools to ensure scalability, performance, and security:
- **Core Framework**: [NestJS](https://nestjs.com/) (v11)
- **Database ORM**: [Prisma](https://www.prisma.io/) (v7.8) optimized with `@prisma/adapter-pg`
- **Database Engine**: PostgreSQL (using the native `pg` driver)
- **Authentication**: JWT (`@nestjs/jwt`, `passport-jwt`, and `bcrypt` for password hashing)
- **Validation**: `class-validator` & `class-transformer` for strict DTO payload checking
- **API Documentation**: Swagger (`@nestjs/swagger`)
- **Language**: TypeScript

## Project Structure

```text
NestJS_Prisma_Tamplate/
├── api/                           # NestJS Backend Application
│   ├── .env.example
│   ├── .gitignore
│   ├── .prettierrc
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── nest-cli.json
│   ├── package-lock.json
│   ├── package.json               # Dependencies and scripts
│   ├── prisma/                    # Prisma Database Schema & Migrations
│   │   ├── migrations/
│   │   │   ├── 20260517082052_init/
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   └── schema.prisma          # Database models
│   ├── prisma.config.ts
│   ├── src/                       # Source Code
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts      # Root controller
│   │   ├── app.module.ts          # Main application module
│   │   ├── app.service.ts         # Root service
│   │   ├── common/                # Reusable common code
│   │   │   ├── decorators/
│   │   │   │   └── get-user.decorators.ts
│   │   │   └── guards/
│   │   │       └── jwt-auth.guard.ts
│   │   ├── main.ts                # Application entry point
│   │   ├── modules/               # Feature Modules
│   │   │   └── auth/              # Authentication Module
│   │   │       ├── auth.controller.spec.ts
│   │   │       ├── auth.controller.ts
│   │   │       ├── auth.module.ts
│   │   │       ├── auth.service.spec.ts
│   │   │       ├── auth.service.ts
│   │   │       ├── dto/           # Data Transfer Objects
│   │   │       │   ├── authResponse.dto.ts
│   │   │       │   ├── login.dto.ts
│   │   │       │   └── register.dto.ts
│   │   │       ├── guards/
│   │   │       │   └── refresh-token.guard.ts
│   │   │       └── strategies/    # Passport strategies
│   │   │           ├── jwt.strategy.ts
│   │   │           └── refresh-token.strategy.ts
│   │   └── prisma/                # Prisma Global Service
│   │       ├── prisma.module.ts
│   │       ├── prisma.service.spec.ts
│   │       └── prisma.service.ts
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   └── tsconfig.json              # TypeScript configuration
└── README.md                      # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL (or access to a Neon/Supabase instance)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MD-Kayesur/NestJS_Prisma_Tamplate.git
   cd NestJS_Prisma_Tamplate
   ```

2. **Setup the Backend**:
   ```bash
   cd api
   npm install
   ```

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env` in the `api` folder.
   - Update the following environment variables in your `.env` file:
     - `PORT`: Server port (default: 3001)
     - `DATABASE_URL`: PostgreSQL connection string (required)
     - `FRONTEND_URL`: URL to allow CORS (default: http://localhost:3000)
     - `JWT_SECRET`: Secret key for Access Tokens (required)
     - `JWT_EXPIRES_IN`: Access token expiration in seconds (default: 900)
     - `JWT_REFRESH_SECRET`: Secret key for Refresh Tokens (required)
   ```bash
   cp .env.example .env
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

## Development

The backend will be running on `http://localhost:3001` (default).

## How It Works

This template provides a robust foundation for building secure and scalable APIs using NestJS and Prisma:

1. **Database Connection (Prisma)**
   - The application connects to PostgreSQL using the `@prisma/adapter-pg` driver.
   - The `PrismaService` handles the database connection lifecycle (`OnModuleInit` / `OnModuleDestroy`) automatically.
   - The database schema (`schema.prisma`) includes common e-commerce and user models out of the box (User, Category, Product, Cart, Order, Payment).

2. **Security & Authentication (JWT)**
   - **Registration/Login**: When a user registers or logs in, the backend issues both a short-lived **Access Token** (15 min) and a long-lived **Refresh Token** (7 days).
   - **Password Hashing**: User passwords and the Refresh Tokens are securely hashed using `bcrypt` before being stored in the database.
   - **Refresh Flow**: To get a new Access Token without logging in again, the client sends the Refresh Token. The backend validates it against the securely hashed token stored in the database.

3. **Global Configuration**
   - **Validation**: Incoming requests are validated automatically using `ValidationPipe`. Any data not defined in the DTOs is securely stripped away.
   - **Swagger Documentation**: The API is automatically documented. Navigate to `http://localhost:3001/api/v1/docs` in your browser when the server is running to test the endpoints interactively.
