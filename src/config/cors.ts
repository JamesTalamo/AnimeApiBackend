import { config } from "dotenv";
import { cors } from "hono/cors";

config();

const allowedOrigins = process.env.ANIWATCH_API_CORS_ALLOWED_ORIGINS
  ? process.env.ANIWATCH_API_CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "https://animeweeb-dev.onrender.com","http://localhost:4173"];

const corsConfig = cors({
  allowMethods: ["GET"],
  maxAge: 600,
  credentials: true,
  origin: (origin) => allowedOrigins.includes(origin) ? origin : false,
});

export default corsConfig;
