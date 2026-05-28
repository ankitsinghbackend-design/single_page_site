# CoreVita Single Page Site Generator

A full-stack monorepo for generating and managing single-page sales funnels, product pages, and contact pages.

## Getting Started

1. `cp .env.example .env` and fill in values (or create a `.env` file based on the required variables).
2. `npm install`
3. `npm run db:generate --workspace=api` && `npm run db:push --workspace=api` (runs drizzle migrations on NeonDB)
4. `npm run db:seed --workspace=api` (creates admin user and demo site)
5. `npm run dev` (starts both api:4000 and admin:3000)

## Project Structure

This is a monorepo utilizing npm workspaces:

- \`apps/admin\`: Next.js 14 (App Router) frontend dashboard. Handles authentication, site management, media library, and complex dynamic form builders for page configurations.
- \`apps/api\`: Express.js backend. Serves as the API for the admin dashboard. Connects to NeonDB via Drizzle ORM and Cloudinary for media uploads.
- \`packages/shared\`: Shared Zod schemas and TypeScript types used by both the frontend and backend to ensure end-to-end type safety.

## Environment Variables

| Variable | Description |
| -------- | ----------- |
| \`DATABASE_URL\` | Connection string for NeonDB PostgreSQL database. |
| \`CLOUDINARY_CLOUD_NAME\` | Cloudinary cloud name for media uploads. |
| \`CLOUDINARY_API_KEY\` | Cloudinary API key. |
| \`CLOUDINARY_API_SECRET\` | Cloudinary API secret. |
| \`JWT_SECRET\` | Secret key used for signing JWT authentication tokens. |
| \`JWT_REFRESH_SECRET\` | Secret key used for signing JWT refresh tokens. |
| \`NEXT_PUBLIC_API_URL\` | The base URL of the API (e.g., \`http://localhost:4000/api/v1\`). |
| \`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME\` | Public cloud name for constructing image URLs on the frontend. |
| \`NEXTAUTH_SECRET\` | NextAuth secret key (min 32 chars). |
| \`NEXTAUTH_URL\` | Base URL for NextAuth (e.g., \`http://localhost:3000\`). |
| \`ADMIN_BOOTSTRAP_EMAIL\` | Email used to bootstrap the initial admin user. |
| \`ADMIN_BOOTSTRAP_PASSWORD\` | Password used to bootstrap the initial admin user. |
| \`CORS_ORIGIN\` | Allowed CORS origin for the API (e.g., \`http://localhost:3000\`). |