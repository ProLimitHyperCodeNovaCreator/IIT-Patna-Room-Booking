const { Worker } = require("bullmq");
const { mailFunction } = require("./nodemailerEngine");
const connection = require("../utils/ioConnection"); // Shared connection

// console.log("Starting email worker...");

// // Verify connection
// connection.on("ready", () => console.log("Redis ready"));
// connection.on("error", (err) => console.error("Redis error", err));

const worker = new Worker(
  "Emails",
  async (job) => {
    //console.log("Processing job:", job.id);
    const { booking, email } = job.data;
    try {
      await mailFunction(email, booking);
      return { status: "success" };
    } catch (error) {
      //console.error(`Failed job ${job.id}:`, error);
      throw error; // Will trigger retry
    }
  },
  {
    connection,
    concurrency: 5,
    lockDuration: 60000,
    removeOnComplete: { age: 3600 }, // Keep for 1 hour then delete
    removeOnFail: { age: 24 * 3600 }, // Keep failed jobs for 1 day
  }
);

// Improved event handlers
// worker.on("completed", (job, returnvalue) => {
//   console.log(`Completed ${job.id}`, returnvalue);
// });

// worker.on("failed", (job, err) => {
//   console.error(`Failed ${job.id}`, err);
// });

// worker.on("error", (err) => {
//   console.error("Worker error", err);
// });

// Handle process termination
process.on("SIGTERM", async () => {
  await worker.close();
  process.exit(0);
});
