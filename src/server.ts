import { config } from "dotenv";

import corsConfig from "./config/cors.js";
import { ratelimit } from "./config/ratelimit.js";

import { hianimeRouter } from "./routes/hianime.js";

import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

import { HiAnimeError } from "aniwatch";

config();

const BASE_PATH = "/api/v2" as const;
const PORT: number = Number(process.env.ANIWATCH_API_PORT) || 4000;
const ANIWATCH_API_HOSTNAME = process.env?.ANIWATCH_API_HOSTNAME;

const app = new Hono();

app.use(logger());
app.use(corsConfig);

// CAUTION: For personal deployments, "refrain" from having an env
// named "ANIWATCH_API_HOSTNAME". You may face rate limitting
// or other issues if you do.
const ISNT_PERSONAL_DEPLOYMENT = Boolean(ANIWATCH_API_HOSTNAME);
if (ISNT_PERSONAL_DEPLOYMENT) {
  app.use(ratelimit);
}

// Serve static files
app.use("/", serveStatic({ root: "public" }));

// Health check route
app.get("/health", (c) => c.text("OK", { status: 200 }));

// Other routes
app.basePath(BASE_PATH).route("/hianime", hianimeRouter);
app
  .basePath(BASE_PATH)
  .get("/anicrush", (c) => c.text("Anicrush could be implemented in future."));

// 404 handler
app.notFound((c) =>
  c.json({ status: 404, message: "Resource Not Found" }, 404)
);

// Error handler
app.onError((err, c) => {
  console.error(err);
  const res = { status: 500, message: "Internal Server Error" };

  if (err instanceof HiAnimeError) {
    res.status = err.status;
    res.message = err.message;
  }

  return c.json(res, { status: res.status });
});

// Server setup
if (!Boolean(process?.env?.ANIWATCH_API_VERCEL_DEPLOYMENT)) {
  serve({
    port: PORT,
    fetch: app.fetch,
  }).addListener("listening", () =>
    console.info(
      "\x1b[1;36m" + `aniwatch-api at http://localhost:${PORT}` + "\x1b[0m"
    )
  );
}

export default app;

