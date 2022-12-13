import redis, {RedisClient} from 'redis';

let client: RedisClient;

export const redisConnect = async (uri: string): Promise<boolean> => new Promise((resolve, _reject) => {
  client = redis.createClient({
    url: uri,
  });

  client.on('connect', () => {
    resolve(true);
  });

  client.on('error', (error) => {
    console.error(error);
    resolve(false);
  });
});

export const redisGet = async <T>(key: string): Promise<T | null> => new Promise((resolve, _reject) => {
  client.get(key, (err, result) => {
    if (null !== err) {
      return resolve(null);
    }

    resolve(
      null === result ? null : JSON.parse(result) as T,
    );
  });
});

export const redisSet = async <T>(k: string, v: T): Promise<void> => new Promise((resolve, _reject) => {
  client.set(k, JSON.stringify(v), (err, _result) => {
    if (null !== err) {
      return resolve();
    }

    resolve();
  });
});

export const redisRemove = async (k: string): Promise<void> => new Promise((resolve, _reject) => {
  client.del(k, (err, _result) => {
    if (null !== err) {
      return resolve();
    }

    resolve();
  });
});
