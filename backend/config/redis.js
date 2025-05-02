const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_URI.split(":")[0],
  port: process.env.REDIS_URI.split(":")[1],
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = client;
