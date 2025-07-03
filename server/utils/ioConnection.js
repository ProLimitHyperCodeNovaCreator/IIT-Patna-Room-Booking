const IORedis = require("ioredis");

module.exports = new IORedis({
    host: "localhost", // or your Redis server IP
    port: 6379,
    maxRetriesPerRequest: null,
    enableOfflineQueue: true, // Enable offline queueing
});