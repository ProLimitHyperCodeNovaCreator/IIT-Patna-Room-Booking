// test-add-job.js
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const testQueue = new Queue('Emails', {
  connection: new IORedis({
    host: "localhost", // Match your worker's config
    port: 6379
  })
});

async function addTestJob() {
  await testQueue.add('test-job', {
    booking: { 
      id: '12345',
      room: {name: 'Conference Room A'},
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 3600000), // 1 hour later
      eventTitle: 'Team Meeting',
      eventDescription: 'Discuss project updates and next steps',
    },
    email: 'test@example.com'
  });
  console.log('Test job added successfully!');
  process.exit(0);
}

addTestJob().catch(console.error);