export class FruitLimitExceededError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FruitLimitExceededError';
    }
}