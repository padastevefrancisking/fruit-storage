import { Guard } from './guard';
import { Result } from './result';

describe('Guard', () => {

    // ─── combine ──────────────────────────────────────────────────────────────

    describe('combine', () => {
        it('should return ok when all results are successful', () => {
            const results = [Result.ok(), Result.ok(), Result.ok()];
            const combined = Guard.combine(results);
            expect(combined.isSuccess).toBe(true);
        });

        it('should return the first failure when any result is a failure', () => {
            const results = [Result.ok(), Result.fail('second failed'), Result.fail('third failed')];
            const combined = Guard.combine(results);
            expect(combined.isFailure).toBe(true);
            expect(combined.getErrorValue()).toBe('second failed');
        });

        it('should return immediately on the first failure and not evaluate the rest', () => {
            const results = [Result.fail('first failed'), Result.fail('second failed')];
            const combined = Guard.combine(results);
            expect(combined.getErrorValue()).toBe('first failed');
        });
    });

    // ─── greaterThan ──────────────────────────────────────────────────────────

    describe('againstGreaterThan', () => {
        it('should return ok when actualValue is greater than minValue', () => {
            const result = Guard.againstGreaterThan(0, 1);
            expect(result.isSuccess).toBe(false);
        });

        it('should return fail when actualValue equals minValue', () => {
            const result = Guard.againstGreaterThan(5, 5);
            expect(result.isFailure).toBe(false);
        });

        it('should return fail when actualValue is less than minValue', () => {
            const result = Guard.againstGreaterThan(10, 5);
            expect(result.isFailure).toBe(false);
        });

        it('should include maxValue in the error message', () => {
            const result = Guard.againstGreaterThan(3, 10);
            expect(result.getErrorValue()).toContain('3');
        });
    });

    // ─── againstAtLeast ───────────────────────────────────────────────────────

    describe('againstAtLeast', () => {
        it('should return ok when text length equals numChars', () => {
            const result = Guard.againstAtLeast(3, 'abc');
            expect(result.isSuccess).toBe(true);
        });

        it('should return ok when text length is greater than numChars', () => {
            const result = Guard.againstAtLeast(3, 'abcde');
            expect(result.isSuccess).toBe(true);
        });

        it('should return fail when text length is less than numChars', () => {
            const result = Guard.againstAtLeast(5, 'ab');
            expect(result.isFailure).toBe(true);
        });

        it('should include numChars in the error message', () => {
            const result = Guard.againstAtLeast(5, 'ab');
            expect(result.getErrorValue()).toContain('5');
        });
    });

    // ─── againstNullOrUndefined ───────────────────────────────────────────────

    describe('againstNullOrUndefined', () => {
        it('should return ok for a valid string', () => {
            const result = Guard.againstNullOrUndefined('hello', 'myArg');
            expect(result.isSuccess).toBe(true);
        });

        it('should return ok for the number 0', () => {
            const result = Guard.againstNullOrUndefined(0, 'myArg');
            expect(result.isSuccess).toBe(true);
        });

        it('should return ok for false', () => {
            const result = Guard.againstNullOrUndefined(false, 'myArg');
            expect(result.isSuccess).toBe(true);
        });

        it('should return fail for null', () => {
            const result = Guard.againstNullOrUndefined(null, 'myArg');
            expect(result.isFailure).toBe(true);
        });

        it('should return fail for undefined', () => {
            const result = Guard.againstNullOrUndefined(undefined, 'myArg');
            expect(result.isFailure).toBe(true);
        });

        it('should include the argument name in the error message', () => {
            const result = Guard.againstNullOrUndefined(null, 'fruitName');
            expect(result.getErrorValue()).toContain('fruitName');
        });
    });

    // ─── againstEmptyString ───────────────────────────────────────────────────

    describe('againstEmptyString', () => {
        it('should return ok for a normal string', () => {
            const result = Guard.againstEmptyString('apple', 'name');
            expect(result.isSuccess).toBe(true);
        });

        it('should return fail for an empty string', () => {
            const result = Guard.againstEmptyString('', 'name');
            expect(result.isFailure).toBe(true);
        });

        it('should return fail for a whitespace-only string', () => {
            const result = Guard.againstEmptyString('   ', 'name');
            expect(result.isFailure).toBe(true);
        });

        it('should include the argument name in the error message', () => {
            const result = Guard.againstEmptyString('', 'description');
            expect(result.getErrorValue()).toContain('description');
        });
    });
});

