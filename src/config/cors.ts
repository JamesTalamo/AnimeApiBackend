import { config } from "dotenv";
import { cors } from "hono/cors";

config();

// const allowedOrigins = process.env.ANIWATCH_API_CORS_ALLOWED_ORIGINS
//   ? process.env.ANIWATCH_API_CORS_ALLOWED_ORIGINS.split(",")
//   : ["https://animeweeb.vercel.app", "http://localhost:4173","http://localhost:5173", "*"];


const corsConfig = cors({
  allowMethods: ["GET"],
  maxAge: 600,
  credentials: true,
  // origin: allowedOrigins,
  origin: "*",
});

export default corsConfig;
