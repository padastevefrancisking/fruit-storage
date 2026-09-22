import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { DomainErrorFilter } from './domain-error.filter';
import { DomainError, FruitErrorCode } from '../../domain/fruit.errors';

describe('DomainErrorFilter', () => {
    let filter: DomainErrorFilter;
    let mockHost: ArgumentsHost;

    beforeEach(() => {
        filter = new DomainErrorFilter();
        mockHost = {} as ArgumentsHost;
    });

    it.each([
        [FruitErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND],
        [FruitErrorCode.NAME_ALREADY_EXISTS, HttpStatus.CONFLICT],
        [FruitErrorCode.STORAGE_LIMIT_EXCEEDED, HttpStatus.CONFLICT],
        [FruitErrorCode.INSUFFICIENT_STOCK, HttpStatus.CONFLICT],
        [FruitErrorCode.CANNOT_DELETE_NON_EMPTY, HttpStatus.CONFLICT],
        [FruitErrorCode.INVALID_DESCRIPTION, HttpStatus.BAD_REQUEST],
        [FruitErrorCode.INVALID_NAME, HttpStatus.BAD_REQUEST],
        [FruitErrorCode.INVALID_LIMIT, HttpStatus.BAD_REQUEST],
        [FruitErrorCode.INVALID_AMOUNT, HttpStatus.BAD_REQUEST],
    ])('should map %s to HttpStatus %i', (code, expectedStatus) => {
        const error = new DomainError(code, `Test error for ${code}`);

        try {
            filter.catch(error, mockHost);
            fail('Expected HttpException to be thrown');
        } catch (thrown) {
            expect(thrown).toBeInstanceOf(HttpException);
            const httpException = thrown as HttpException;
            expect(httpException.getStatus()).toBe(expectedStatus);
            expect(httpException.getResponse()).toEqual({
                code,
                message: `Test error for ${code}`,
            });
        }
    });

    it('should default to HttpStatus.BAD_REQUEST when error code is unknown', () => {
        const unknownError = new DomainError('UNKNOWN_CODE' as FruitErrorCode, 'Unknown error message');

        try {
            filter.catch(unknownError, mockHost);
            fail('Expected HttpException to be thrown');
        } catch (thrown) {
            expect(thrown).toBeInstanceOf(HttpException);
            const httpException = thrown as HttpException;
            expect(httpException.getStatus()).toBe(HttpStatus.BAD_REQUEST);
            expect(httpException.getResponse()).toEqual({
                code: 'UNKNOWN_CODE',
                message: 'Unknown error message',
            });
        }
    });
});
