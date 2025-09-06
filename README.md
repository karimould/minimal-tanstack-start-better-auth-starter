# Minimal TanStack Start - TanStack Query - Better Auth - Drizzle - Postgres Starter

## Description
This is a minimal starter project for TanStack Start with TanStack Router, TanStack Query, ZOD, Better Auth, Drizzle, Postgres, and Docker. It includes a complete CRUD example with user authentication and post management functionality.

## Stack
- React
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- ZOD
- Better Auth
- Drizzle
- Postgres
- Docker

## ToDos
- write Readme
- clean up code
- clean up folder structure
- make it more beautefull
- maybe add tailwind / shadcn
- maybe add form lib
- maybe add some more features
- maybe add seed data

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up your environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

2. Start Database 
   ```bash
   docker-compose up
   ```

3. Run database migrations:
   ```bash
   pnpm run db:migrate
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

## Drizzle Commands

- `pnpm run db:generate` - Generate migration files
- `pnpm run db:migrate` - Run migrations
- `pnpm run db:push` - Push schema changes directly to database
- `pnpm run db:studio` - Open Drizzle Studio

For more information, see the [Drizzle documentation](https://orm.drizzle.team/docs/overview).

