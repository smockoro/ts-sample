import { RedisClient } from './redis.client';

describe('Redis Client', () => {
  let redis: RedisClient;

  beforeAll(async () => {
    redis = new RedisClient();
  });

  afterAll(async () => {
    redis && (await redis.quit());
  });

  const defaultRedisData = [
    { key: 'sampleKey1', value: 'sampleValue1' },
    { key: 'sampleKey2', value: 'sampleValue2' },
    { key: 'sampleKey3', value: 'sampleValue3' },
    { key: 'sampleKey4', value: 'sampleValue4' },
  ];
  beforeEach(async () => {
    defaultRedisData.map(async (elem) => {
      await redis.set(elem.key, elem.value);
    });
  });

  afterEach(async () => {
    await redis.flushAll();
  });

  const setCases = [['sampleKey', 'sampleValue', 'sampleValue']];
  it.each(setCases)(
    'set to Redis(Key=%s,Value=%s), expected value %s',
    async (key, value, expected) => {
      await redis.set(key, value);
      const actual = await redis.get(key);
      expect(actual).toBe(expected);
    },
  );

  const getCases = [['sampleKey1', 'sampleValue1']];
  it.each(getCases)(
    'get from Redis(key=%s), expected value %s',
    async (key, expected) => {
      const actual = await redis.get(key);
      expect(actual).toBe(expected);
    },
  );

  const delCases = [
    ['sampleKey1', '1'],
    ['sample', '0'],
  ];
  it.each(delCases)(
    'del to Redis(key=%s), expected return %s',
    async (key, expected) => {
      const ok = await redis.delete(key);
      expect(ok).toBe(Number(expected));
    },
  );
});
