# NestJS_Prisma_Tamplate

This is a full-stack project with a NestJS backend and (planned) NextJS frontend.

## Project Structure

- `api/`: NestJS backend application.

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
