import { FruitStorageLimit } from './fruit-storage-limit.vo';

describe('FruitStorageLimit', () => {

    // ─── Happy path ───────────────────────────────────────────────────────────

    it('should create successfully with a positive limit', () => {
        const result = FruitStorageLimit.create(100);
        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBeInstanceOf(FruitStorageLimit);
    });

    it('should expose the limit value via getter', () => {
        const result = FruitStorageLimit.create(50);
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().value).toBe(50);
    });

    it('should allow limit of 0 if 0 is a valid storage limit', () => {
        const result = FruitStorageLimit.create(0);
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().value).toBe(0);
    });

    it('should consider two FruitStorageLimits with same value equal', () => {
        const limitA = FruitStorageLimit.create(100).getValue();
        const limitB = FruitStorageLimit.create(100).getValue();
        expect(limitA.equals(limitB)).toBe(true);
    });

    it('should consider two FruitStorageLimits with different values not equal', () => {
        const limitA = FruitStorageLimit.create(100).getValue();
        const limitB = FruitStorageLimit.create(200).getValue();
        expect(limitA.equals(limitB)).toBe(false);
    });

    // ─── Null / Undefined ─────────────────────────────────────────────────────

    it('should fail when null is passed', () => {
        const result = FruitStorageLimit.create(null as any);
        expect(result.isFailure).toBe(true);
    });

    it('should fail when undefined is passed', () => {
        const result = FruitStorageLimit.create(undefined as any);
        expect(result.isFailure).toBe(true);
    });

    // ─── Negative limit ───────────────────────────────────────────────────────

    it('should fail when limit is negative', () => {
        const result = FruitStorageLimit.create(-1);
        expect(result.isFailure).toBe(true);
    });

    it('should fail for large negative numbers', () => {
        const result = FruitStorageLimit.create(-100);
        expect(result.isFailure).toBe(true);
    });
});

