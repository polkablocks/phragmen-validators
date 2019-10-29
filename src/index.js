const redis = require('redis');
const fs = require('fs');


let fileData = fs.readFileSync('/home/enitan/phragmen/validators/validators.json')
let client;
const validators = JSON.parse(fileData)

if (process.env.REDIS_URL) {
  const rtg = require('url').parse(process.env.REDIS_URL);
  client = require('redis').createClient(rtg.port, rtg.hostname);

  client.auth(rtg.auth.split(':')[1]);
} else {
  client = redis.createClient();
}

client.on('connect', async function() {
  console.log('Redis client connected');
  client.set('PhragmenValidators', JSON.stringify(validators), redis.print);
  client.quit();
});

client.on('error', function(err) {
  console.log(`Something went wrong ${err}`);
});
