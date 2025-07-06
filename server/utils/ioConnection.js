const IORedis = require("ioredis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null, // ✅ REQUIRED by BullMQ
  enableReadyCheck: true,
});

module.exports = connection;
