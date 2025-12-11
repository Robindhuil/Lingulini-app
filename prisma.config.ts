import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Load .env file
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: `tsx prisma/seed.ts`,
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public",
  },
});
