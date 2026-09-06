import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getStats } from "../controllers/stats.controller.js";

const router = express.Router();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

const requestsByIp = new Map();

function rateLimit(req, res, next) {
  const now = Date.now();

  const ip = req.ip;

  const current = requestsByIp.get(ip);

  if (!current || now >= current.resetAt) {
    requestsByIp.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return next();
  }

  current.count += 1;

  if (current.count > MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000)
    );

    res.setHeader("Retry-After", retryAfterSeconds);

    return res.status(429).send("Too many requests");
  }

  return next();
}

const cleanupTimer = setInterval(() => {
  const now = Date.now();

  for (const [ip, data] of requestsByIp.entries()) {
    if (now >= data.resetAt) {
      requestsByIp.delete(ip);
    }
  }
}, WINDOW_MS);

cleanupTimer.unref?.();

router.get("/", rateLimit, asyncHandler(getStats));

export default router;
