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
   git clone https://github.com/MD-Kayesur/Nest_js_Next_js_Full_Stack_Project.git
   cd Nest_js_Next_js_Full_Stack_Project
   ```

2. **Setup the Backend**:
   ```bash
   cd api
   npm install
   ```

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env` in the `api` folder.
   - Update `DATABASE_URL` and `PORT` as needed.
   ```bash
   cp .env.example .env
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```

## Development

The backend will be running on `http://localhost:3001` (default).
