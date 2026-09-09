import { FruitDescription } from './fruit-description.vo';

describe('FruitDescription', () => {

    // ─── Happy path ───────────────────────────────────────────────────────────

    it('should create successfully with a valid description', () => {
        const result = FruitDescription.create('A sweet red fruit');
        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBeInstanceOf(FruitDescription);
    });

    it('should expose the trimmed value via getter', () => {
        const result = FruitDescription.create('  Tasty fruit  ');
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().value).toBe('Tasty fruit');
    });

    it('should succeed with exactly 30 characters', () => {
        const exactly30 = 'A'.repeat(30); // 30 chars
        const result = FruitDescription.create(exactly30);
        expect(result.isSuccess).toBe(true);
    });

    it('should consider two FruitDescriptions with the same value equal', () => {
        const a = FruitDescription.create('A sweet fruit').getValue();
        const b = FruitDescription.create('A sweet fruit').getValue();
        expect(a.equals(b)).toBe(true);
    });

    it('should consider two FruitDescriptions with different values not equal', () => {
        const a = FruitDescription.create('A sweet fruit').getValue();
        const b = FruitDescription.create('A sour fruit').getValue();
        expect(a.equals(b)).toBe(false);
    });

    // ─── Max length ───────────────────────────────────────────────────────────

    it('should fail when description exceeds 30 characters', () => {
        const tooLong = 'A'.repeat(31); // 31 chars
        const result = FruitDescription.create(tooLong);
        expect(result.isFailure).toBe(true);
    });

    it('should include the character count in the error message when too long', () => {
        const tooLong = 'A'.repeat(31);
        const result = FruitDescription.create(tooLong);
        expect(result.getErrorValue()).toContain('31');
    });

    // ─── Null / undefined ─────────────────────────────────────────────────────

    it('should fail when null is passed', () => {
        const result = FruitDescription.create(null as any);
        expect(result.isFailure).toBe(true);
    });

    it('should fail when undefined is passed', () => {
        const result = FruitDescription.create(undefined as any);
        expect(result.isFailure).toBe(true);
    });

    // ─── Empty / whitespace ───────────────────────────────────────────────────

    // NOTE: There is a known bug in fruit-description.vo.ts (line 29) where
    // `emptyGuardResponse` is checked but `nullGuardResponse` variable is used
    // instead. This means empty string validation is currently broken.
    // The tests below are written for the INTENDED behaviour — fix the bug
    // by changing line 29 to check `emptyGuardResponse.isFailure`.

    it('should fail for an empty string', () => {
        const result = FruitDescription.create('');
        expect(result.isFailure).toBe(true);
    });

    it('should fail for a whitespace-only string', () => {
        const result = FruitDescription.create('   ');
        expect(result.isFailure).toBe(true);
    });
});

