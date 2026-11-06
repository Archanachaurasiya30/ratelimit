// Redis import ioredis use for connect to redis library
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");


const LUA = `
local c = redis.call('INCR', KEYS[1])
if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
local ttl = redis.call('TTL', KEYS[1])
return {c, ttl}
`;

//define the rate limit function
function rateLimit({ name, limit, windowSec, keyFn }) {
  return async (req, res, next) => {  //asynchronous middleware
    try {
      const who = keyFn(req);
      const key = `rl:${name}:${who}`;  //create redis key
      const [count, ttl] = await redis.eval(LUA, 1, key, windowSec); //execute lua concept
      const wait = ttl > 0 ? ttl : windowSec;
// set the maximum request in limit header and showing how many request remain
      res.set("X-RateLimit-Limit", String(limit));
      res.set("X-RateLimit-Remaining", String(Math.max(0, limit - count)));

      if (count > limit) {
        res.set("Retry-After", String(wait)); //return 429 too many request
        return res.status(429).json({
          error: "Too many requests",
          retryAfterSeconds: wait,
          message: `Try again in ${wait} seconds.`,
        });
      }
      next();
    } catch (err) {  //catch error that occur during redis operation
      
      console.error("rate limiter error:", err.message);
      next();
    }
  };
}

module.exports = { rateLimit };