import { createClient } from 'redis';

const { REDIS_HOST, REDIS_PORT } = process.env;
const redisUrl = `redis://${REDIS_HOST}:${REDIS_PORT}`;

const client = createClient({
  url: redisUrl,
  password: process.env.REDIS_PASS,
});

client.on('error', (err) => console.log('Redis Client Error', err));

export async function getSyncData<T>(subKey: string): Promise<T> {
  const pub = client.duplicate();
  await pub.connect();
  const sub = client.duplicate();
  await sub.connect();
  const obj = {};
  sub.subscribe(subKey, (data) => {
    const { key, val } = JSON.parse(data);
    obj[key] = val;
  });
  return new Proxy(obj, {
    set(obj, key, val) {
      obj[key] = val;
      pub.publish(subKey, JSON.stringify({ key, val })).catch(console.error);
      return true;
    },
  }) as T;
}
