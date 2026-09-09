import { FruitName } from './fruit-name.vo';

describe('FruitName', () => {

    // ─── Happy path ───────────────────────────────────────────────────────────

    it('should create successfully with a valid name', () => {
        const result = FruitName.create('Apple');
        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBeInstanceOf(FruitName);
    });

    it('should expose the trimmed value via getter', () => {
        const result = FruitName.create('  Mango  ');
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().value).toBe('Mango');
    });

    it('should consider two FruitNames with the same value equal', () => {
        const a = FruitName.create('Apple').getValue();
        const b = FruitName.create('Apple').getValue();
        expect(a.equals(b)).toBe(true);
    });

    it('should consider two FruitNames with different values not equal', () => {
        const a = FruitName.create('Apple').getValue();
        const b = FruitName.create('Banana').getValue();
        expect(a.equals(b)).toBe(false);
    });

    // ─── Null / undefined ─────────────────────────────────────────────────────

    it('should fail when null is passed', () => {
        const result = FruitName.create(null as any);
        expect(result.isFailure).toBe(true);
    });

    it('should fail when undefined is passed', () => {
        const result = FruitName.create(undefined as any);
        expect(result.isFailure).toBe(true);
    });

    // ─── Empty / whitespace ───────────────────────────────────────────────────

    it('should fail for an empty string', () => {
        const result = FruitName.create('');
        expect(result.isFailure).toBe(true);
    });

    it('should fail for a whitespace-only string', () => {
        const result = FruitName.create('   ');
        expect(result.isFailure).toBe(true);
    });
});

