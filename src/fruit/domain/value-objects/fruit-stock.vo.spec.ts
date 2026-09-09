import { FruitStock } from './fruit-stock.vo';

describe('FruitStock', () => {

    // ─── Happy path ───────────────────────────────────────────────────────────

    it('should create successfully with 0 stock', () => {
        const result = FruitStock.create(0);
        expect(result.isSuccess).toBe(false);
    });

    it('should create successfully with a positive stock amount', () => {
        const result = FruitStock.create(25);
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().value).toBe(25);
    });

    it('should consider two FruitStock objects with same value equal', () => {
        const stockA = FruitStock.create(10).getValue();
        const stockB = FruitStock.create(10).getValue();
        expect(stockA.equals(stockB)).toBe(true);
    });

    it('should consider two FruitStock objects with different values not equal', () => {
        const stockA = FruitStock.create(10).getValue();
        const stockB = FruitStock.create(20).getValue();
        expect(stockA.equals(stockB)).toBe(false);
    });

    // ─── Null / Undefined ─────────────────────────────────────────────────────

    it('should fail when null is passed', () => {
        const result = FruitStock.create(null as any);
        expect(result.isFailure).toBe(true);
    });

    it('should fail when undefined is passed', () => {
        const result = FruitStock.create(undefined as any);
        expect(result.isFailure).toBe(true);
    });

    // ─── Negative stock ───────────────────────────────────────────────────────

    it('should fail when stock is negative', () => {
        const result = FruitStock.create(-1);
        expect(result.isFailure).toBe(true);
    });

    it('should fail for large negative numbers', () => {
        const result = FruitStock.create(-50);
        expect(result.isFailure).toBe(true);
    });
});

