import "dotenv/config"
import { defineConfig } from "drizzle-kit"

const connectionString = process.env.DATABASE_URL!

export default defineConfig({
  schema: "./src/utils/db/schema",
  out: "./src/utils/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
})
