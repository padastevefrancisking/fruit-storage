export enum FruitErrorCode {
    NAME_ALREADY_EXISTS = 'FRUIT_NAME_ALREADY_EXISTS',
    NOT_FOUND = 'FRUIT_NOT_FOUND',
    INVALID_DESCRIPTION = 'FRUIT_INVALID_DESCRIPTION',
    INVALID_NAME = 'FRUIT_INVALID_NAME',
    STORAGE_LIMIT_EXCEEDED = 'FRUIT_STORAGE_LIMIT_EXCEEDED',
    INSUFFICIENT_STOCK = 'FRUIT_INSUFFICIENT_STOCK',
    CANNOT_DELETE_NON_EMPTY = 'CANNOT_DELETE_NON_EMPTY',
    INVALID_AMOUNT = 'FRUIT_INVALID_AMOUNT'
}

export class DomainError extends Error {
    constructor(
        public readonly code: FruitErrorCode,
        message: string
    ) {
        super(message);
        this.name = 'DomainError'
    }
}