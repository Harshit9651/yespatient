const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('end', () => {
  console.log('Redis client disconnected');
});

process.on('SIGINT', () => {
  client.quit(() => {
    console.log('Redis client closed');
    process.exit(0);
  });
});

module.exports = client;
