import { getCache, setCache, deleteCache, deleteCachePattern, withCache } from '../cache';
import { CacheTTL } from '../redis';

// Mock Redis client
jest.mock('../redis', () => ({
  getRedisClient: jest.fn(() => null), // Use in-memory cache for tests
  CacheTTL: {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
    DAY: 86400,
  },
}));

// Mock logger
jest.mock('../logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

describe('Cache Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setCache and getCache', () => {
    it('should store and retrieve values from cache', async () => {
      const key = 'test:key';
      const value = { id: '123', name: 'Test' };

      await setCache(key, value, CacheTTL.SHORT);
      const cached = await getCache(key);

      expect(cached).toEqual(value);
    });

    it('should return null for non-existent keys', async () => {
      const cached = await getCache('non:existent:key');
      expect(cached).toBeNull();
    });

    it('should handle different data types', async () => {
      const stringValue = 'test string';
      const numberValue = 42;
      const arrayValue = [1, 2, 3];
      const objectValue = { nested: { data: true } };

      await setCache('string', stringValue);
      await setCache('number', numberValue);
      await setCache('array', arrayValue);
      await setCache('object', objectValue);

      expect(await getCache('string')).toBe(stringValue);
      expect(await getCache('number')).toBe(numberValue);
      expect(await getCache('array')).toEqual(arrayValue);
      expect(await getCache('object')).toEqual(objectValue);
    });
  });

  describe('deleteCache', () => {
    it('should delete cached values', async () => {
      const key = 'test:delete';
      const value = { data: 'test' };

      await setCache(key, value);
      expect(await getCache(key)).toEqual(value);

      await deleteCache(key);
      expect(await getCache(key)).toBeNull();
    });
  });

  describe('deleteCachePattern', () => {
    it('should delete multiple keys matching pattern', async () => {
      await setCache('brand:test1', { id: '1' });
      await setCache('brand:test2', { id: '2' });
      await setCache('user:test', { id: '3' });

      await deleteCachePattern('brand:*');

      expect(await getCache('brand:test1')).toBeNull();
      expect(await getCache('brand:test2')).toBeNull();
      expect(await getCache('user:test')).toEqual({ id: '3' });
    });
  });

  describe('withCache', () => {
    it('should cache function results', async () => {
      const mockFn = jest.fn().mockResolvedValue({ data: 'result' });
      const key = 'function:cache';

      const result1 = await withCache(key, mockFn, CacheTTL.SHORT);
      const result2 = await withCache(key, mockFn, CacheTTL.SHORT);

      expect(result1).toEqual({ data: 'result' });
      expect(result2).toEqual({ data: 'result' });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should execute function if cache is empty', async () => {
      const mockFn = jest.fn().mockResolvedValue({ data: 'new' });
      const key = 'function:new';

      const result = await withCache(key, mockFn);

      expect(result).toEqual({ data: 'new' });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
