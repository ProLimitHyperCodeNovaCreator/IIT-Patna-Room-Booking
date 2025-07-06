const {Redis} = require('ioredis');
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const client = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // ✅ Required by BullMQ
  enableReadyCheck: true,
});

module.exports = client;