import { Redis } from "ioredis";

export const redisInstance = new Redis(
  process.env.REDIS_URL || "redis://redis:6379",
);

redisInstance.on("error", (err) => console.error("Redis Error:", err));
